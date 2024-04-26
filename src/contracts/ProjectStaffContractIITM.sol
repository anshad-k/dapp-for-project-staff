pragma solidity ^0.8.0;

contract projectStaffContractIITM {

    enum ProjectStatus {
        PENDING, 
        APPROVED, 
        REJECTED, 
        COMPLETED,
        EXTENSION
    }

    struct Faculty {
        string name;
        address payable facultyAddress;
        string department;
        string email;
        uint[] projectIds;
    }

    struct Project {
        uint id;
        string title;
        string description;
        ProjectStatus status;
        string startDate;
        string endDate;
        uint salary;
        address payable projectStaffAddress;
        address payable[] faculties;
        address payable currentApprover;
    }

    struct ProjectStaff {
        string name;
        address payable staffAddress;
        string email;
        uint[] projectIds;
    }

    address payable admin;

    Faculty[] private faculties;
    mapping (address => uint) facultyMap;

    ProjectStaff[] private projectStaffs;
    mapping (address => uint) staffMap;

    Project[] private projects;

    constructor() public {
        admin = payable(msg.sender);
     }

    function registerFaculty(
        string calldata _name, 
        string calldata _department,
        string calldata _email
      ) external returns (uint) {
      if(facultyMap[msg.sender] != 0) {
        // Already registered
        return 4;
      }
      faculties.push(Faculty({
        name: _name,
        facultyAddress: payable(msg.sender),
        department: _department,
        email: _email,
        projectIds: new uint[](0)
      }));
      facultyMap[msg.sender] = faculties.length; // 1-indexed
      return 2;
    }

    function loginFaculty() external view returns (uint) {
      if(facultyMap[msg.sender] == 0) {
        return 4;
      }
      return 2;
    }

    function registerProjectStaff(
        string calldata _name, 
        string calldata _email
      ) external returns (uint) {
      if(facultyMap[msg.sender] != 0) {
        // Already registered
        return 4;
      }
      projectStaffs.push(ProjectStaff({
        name: _name,
        staffAddress: payable(msg.sender),
        email: _email,
        projectIds: new uint[](0)
      }));
      staffMap[msg.sender] = projectStaffs.length; // 1-indexed
      return 2;
    }

    function loginProjectStaff() external view returns (uint) {
      if(staffMap[msg.sender] == 0) {
        return 4;
      }
      return 2;
    }

    function addProject(
      string calldata _title,
      string calldata _description,
      string calldata _startDate,
      string calldata _endDate,
      uint _salary,
      uint256[] calldata _facultyAddresses
    ) external returns (uint) {
      if(staffMap[msg.sender] == 0 || _facultyAddresses.length == 0) {
        return 4;
      }
      projects.push(Project({
        id: projects.length + 1, // 1-indexed
        title: _title,
        description: _description,
        status: ProjectStatus.PENDING,
        startDate: _startDate,
        endDate: _endDate,
        salary: _salary,
        projectStaffAddress: payable(msg.sender),
        faculties: new address payable[](0),
        currentApprover: payable(admin)
      }));

      Project storage newProject = projects[projects.length - 1];

      for(uint i = 0; i < _facultyAddresses.length; i++) {
        address payable facultyAddress = payable(uint256ToAddress(_facultyAddresses[i]));
        newProject.faculties.push(facultyAddress);
        faculties[facultyMap[facultyAddress] - 1].projectIds.push(projects.length);
      }

      projectStaffs[staffMap[msg.sender] - 1].projectIds.push(projects.length);
      newProject.currentApprover = payable(uint256ToAddress(_facultyAddresses[0]));
      return 2;
    }

    function scheduleSalaryTransaction(uint _projectId) private returns (uint) {
      if( _projectId > projects.length) {
        return 4;
      }
      Project storage project = projects[_projectId - 1];
      if(staffMap[project.projectStaffAddress] == 0) {
        return 4;
      }
      
      if(project.status != ProjectStatus.APPROVED) {
        return 5;
      }
      if(project.endDate < block.timestamp) {
        return 6;
      }
      project.projectStaffAddress.transfer(project.salary);
      project.status = ProjectStatus.COMPLETED;
      return 2;
    }

    function approveProject(uint calldata _projectId, bool calldata approval) external returns (uint) {
      if(facultyMap[msg.sender] == 0 || _projectId > projects.length) {
        return 4;
      }
      Project storage project = projects[_projectId - 1];
      if(project.status != ProjectStatus.PENDING && project.status != ProjectStatus.EXTENSION) {
        return 5;
      }
      if(project.currentApprover != msg.sender) {
        return 6;
      }
      if(approval) {
        project.status = ProjectStatus.APPROVED;
        scheculeSalaryTransaction(_projectId);
      } else {
        project.status = ProjectStatus.REJECTED;
      }
      return 2;
    }

    function getExtension(
        uint calldata _projectId, 
        string calldata _newEndDate,
      ) external returns (uint) {
      if(projectStaffs[msg.sender] == 0 || _projectId > projects.length) {
        return 4;
      }
      Project storage project = projects[_projectId - 1];
      if(project.status != ProjectStatus.APPROVED) {
        return 5;
      }
      project.status = ProjectStatus.EXTENSION;
      project.endDate = _newEndDate;
      return 2;
    }

    function getAllFaculties() external view returns (Faculty[] memory) {
      return faculties;
    }

    function getAllProjects() external view returns (Project[] memory) {
      return projects;
    }

    function addressToUint256(address _addr) private pure returns (uint256) {
        uint160 _uint = uint160(_addr);
        return uint256(_uint);
    }

    function uint256ToAddress(uint256 _uint) private pure returns (address) {
        return address(uint160(_uint));
    }

    function tokenAssoTrans(int64 _amount) external {        
    }
}