// SPDX-License-Identifier: GPL-4.0
pragma solidity >=0.8.9 <0.9.0;

contract projectStaffContractIITM {

    enum ProjectStatus {
        PENDING, 
        APPROVED, 
        REJECTED, 
        COMPLETED,
        EXTEND
    }

    enum UserType {
      ADMIN,
      FACULTY,
      PROJECT_STAFF,
      UNKNOWN
    }

    uint32 private MAX_SIZE = 300;
    uint32 private MAX_PROJECTS = 500;

    struct Faculty {
        bytes20 name;
        address payable facultyAddress;
        bytes20 department;
        bytes20 email;
        uint16[] projectIds;
    }

    struct ShowFaculty {
      uint16 id;
      bytes20 name;
    }

    struct Project {
        uint16 id;
        bytes20 title;
        bytes30 description;
        ProjectStatus status;
        uint64 startDate;    // unix epoch in ms
        uint64 endDate;
        uint32 salary;
        uint16[] projectStaffs;
        uint16[] faculties;
        address payable currentApprover;
    }

    struct ShowProject {
        uint16 id;
        bytes20 title;
        bytes30 description;
        ProjectStatus status;
        uint64 startDate;
        uint64 endDate;
        uint32 salary;
        address staffAddress;
    }

    struct ProjectStaff {
        bytes20 name;
        address payable staffAddress;
        bytes20 email;
        uint16[] projectIds;
    }

    struct ShowStaff {
      uint16 id;
      bytes20 name;
      address staffAddress;
    }

    address payable admin;

    Faculty[] public faculties;
    mapping (address => uint16) facultyMap;

    ProjectStaff[] public projectStaffs;
    mapping (address => uint16) staffMap;

    Project[] public projects;


    constructor() payable {
        admin = payable(msg.sender);
    }

    function login() external view returns (UserType) {
      if(msg.sender == admin) {
        return UserType.ADMIN;
      } else if(facultyMap[msg.sender] != 0) {
        return UserType.FACULTY;
      } else if(staffMap[msg.sender] != 0) {
        return UserType.PROJECT_STAFF;
      } else {
        return UserType.UNKNOWN;
      }
    }

    function registerFaculty(
        string calldata _name, 
        string calldata _department,
        string calldata _email
      ) external returns (uint8) {
      require(facultyMap[msg.sender] == 0 && staffMap[msg.sender] == 0, "4 : user already exists");
      require(faculties.length < MAX_SIZE, "5 : max capacity reached");

      faculties.push(Faculty({
        name: bytes20(bytes(_name)),
        facultyAddress: payable(msg.sender),
        department: bytes20(bytes(_department)),
        email: bytes20(bytes(_email)),
        projectIds: new uint16[](0)
      }));
      facultyMap[msg.sender] = uint16(faculties.length); // 1-indexed
      return 2;
    }

    function registerProjectStaff(
        string calldata _name, 
        string calldata _email
      ) external returns (uint8) {
      require(facultyMap[msg.sender] == 0 && staffMap[msg.sender] == 0, "4 : user already exists");
      require(projectStaffs.length < MAX_SIZE, "5 : max capacity reached");

      projectStaffs.push(ProjectStaff({
        name: bytes20(bytes(_name)),
        staffAddress: payable(msg.sender),
        email: bytes20(bytes(_email)),
        projectIds: new uint16[](0)
      }));
      staffMap[msg.sender] = uint16(projectStaffs.length); // 1-indexed
      return 2;
    }

    function addProject(
      string calldata _title,
      string calldata _description,
      uint64 _startDate,
      uint64 _endDate,
      uint32 _salary,
      uint16[] calldata _projectStaffIds,
      uint16[] calldata _facultyIds
    ) external returns (uint8) {
      require(staffMap[msg.sender] != 0, "4 : Invalid user");
      require(_startDate <= _endDate, "7 : invalid dates");
      require(projects.length < MAX_PROJECTS, "5 : max number of projects reached");
      require(
        1 < _facultyIds.length && _facultyIds.length <= 4 &&
        0 <= _projectStaffIds.length && _projectStaffIds.length <= 4,
        "5 : does not satisfy staff and faculty requirement"
      );

      for(uint16 i = 0; i < _facultyIds.length; i++) {
        uint16 facultyIdx = _facultyIds[i] - 1;   // id is 1 indexed
        require(facultyIdx < faculties.length, "6 : No id exists");
        faculties[facultyIdx].projectIds.push(uint16(projects.length + 1));
      }

      for(uint16 i = 0; i < _projectStaffIds.length; i++) {
        uint16 staffIdx = _projectStaffIds[i] - 1;
        require(staffIdx < projectStaffs.length, "6 : No id exists");
        projectStaffs[staffIdx].projectIds.push(uint16(projects.length + 1));
      }

      projects.push(Project({
        id: uint16(projects.length + 1), // 1-indexed
        title: bytes20(bytes(_title)),
        description: bytes30(bytes(_description)),
        status: ProjectStatus.PENDING,
        startDate: _startDate,
        endDate: _endDate,
        salary: _salary,
        projectStaffs: _projectStaffIds,
        faculties: _facultyIds,
        currentApprover: payable(address(0))
      }));

      projects[projects.length - 1].projectStaffs.push(staffMap[msg.sender]);
      return 2;
    }


    function approveProject(uint _projectId, bool _approval) external returns (uint8) {
      require(facultyMap[msg.sender] != 0 && _projectId <= projects.length, "4 : Invalid user or project");
      Project storage project = projects[_projectId - 1];
      require(project.status == ProjectStatus.PENDING || project.status == ProjectStatus.EXTEND, "5 : project is not pending");

      for(uint i = 0; i < project.faculties.length; i++) {
        if(project.faculties[i] == facultyMap[msg.sender]) { // 0 indexed
          project.currentApprover = payable(msg.sender);
          if(_approval) {
            project.status = ProjectStatus.APPROVED;
          } else {
            project.status = ProjectStatus.REJECTED;
          }
          return 2;
        }
      }
      return 6;
    }

    function getExtendedPeriod(
        uint16 _projectId, 
        uint64 _newEndDate
      ) external returns (uint8) {
      require(staffMap[msg.sender] != 0 && _projectId <= projects.length, "4 : invalid user");

      Project storage project = projects[_projectId - 1];
      require(project.status == ProjectStatus.APPROVED, "5 : project is not approved");
      require(project.endDate <= _newEndDate, "5 : invalid end date");
      project.status = ProjectStatus.EXTEND;
      project.endDate = _newEndDate;
      return 2;
    }

    function salaryTransfer(uint16 projectId) external payable {
      require(admin == msg.sender, "4 : Not admin");
      require(projectId <= projects.length, "4 : Project id does not exists");
      Project storage project = projects[projectId - 1];
      require(project.status == ProjectStatus.APPROVED, "4 : the project is pending");
      require(block.timestamp >= project.endDate, "5 : Project is not completed");
      require(project.salary == msg.value, "5 : incorrect amount to transfer");
      for(uint16 i = 0; i < project.projectStaffs.length; i++) {
        require(admin.balance >= msg.value, "5 : insufficient balance");
        bool success = projectStaffs[project.projectStaffs[i] - 1].staffAddress.send(msg.value);
        require(success, "5 : Payment failed");
      }
    }

    function getAllFaculties() external view returns (ShowFaculty[] memory) {
      ShowFaculty[] memory allFaculties = new ShowFaculty[](faculties.length);
      for(uint16 i = 0; i < faculties.length; i++) {
        allFaculties[i].id = i + 1;
        allFaculties[i].name = faculties[i].name;
      }
      return allFaculties;
    }

    function getAllProjects(bool needAll) external view returns (ShowProject[] memory) {   
      if(needAll) {
        ShowProject[] memory allProjects = new ShowProject[](projects.length);
        for(uint16 i = 0; i < projects.length; i++) {
          allProjects[i] = ShowProject({
            id: projects[i].id,
            title: projects[i].title,
            description: projects[i].description,
            status: projects[i].status,
            startDate: projects[i].startDate,
            endDate: projects[i].endDate,
            salary: projects[i].salary,
            staffAddress: projectStaffs[projects[i].projectStaffs[0] - 1].staffAddress
          });
        }
        return allProjects;
      }
      uint16[] storage userProjectIds;
      if(facultyMap[msg.sender] != 0) {
        userProjectIds = faculties[facultyMap[msg.sender] - 1].projectIds;
      } else if(staffMap[msg.sender] != 0) {
        userProjectIds = projectStaffs[staffMap[msg.sender] - 1].projectIds;
      } else {
        return new ShowProject[](0);
      }
      ShowProject[] memory userProjects = new ShowProject[](userProjectIds.length);
      for(uint16 i = 0; i < userProjectIds.length; i++) {
        Project storage proj = projects[userProjectIds[i] - 1];
        userProjects[i] = ShowProject({
            id: proj.id,
            title: proj.title,
            description: proj.description,
            status: proj.status,
            startDate: proj.startDate,
            endDate: proj.endDate,
            salary: proj.salary,
            staffAddress: projectStaffs[proj.projectStaffs[0] - 1].staffAddress
          });
      }
      return userProjects;
    }

    function getAllProjectStaffs() external view returns (ShowStaff[] memory) {
      ShowStaff[] memory allProjectStaffs = new ShowStaff[](projectStaffs.length);
      for(uint16 i = 0; i < projectStaffs.length; i++) {
        allProjectStaffs[i].id = i + 1;
        allProjectStaffs[i].name = projectStaffs[i].name;
        allProjectStaffs[i].staffAddress = projectStaffs[i].staffAddress;
      }
      return allProjectStaffs;
    }
}
