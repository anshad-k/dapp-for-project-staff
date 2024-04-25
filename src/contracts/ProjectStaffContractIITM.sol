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
    }

    struct Project {
        uint id;
        string title;
        string description;
        ProjectStatus status;
        string startDate;
        string endDate;
        uint salary;
        address payable[] faculties;
    }

    struct ProjectStaff {
        string name;
        address payable staffAddress;
        string email;
        Project[] projects;
    }

    address payable admin;

    Faculty[] private faculties;
    mapping (address => uint) facultyMap;

    ProjectStaff[] private projectStaffs;
    mapping (address => uint) staffMap;

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
        email: _email
      }));
      facultyMap[msg.sender] = faculties.length; // 1-indexed
      return 2;
    }

    function loginFaculty() external view returns (Project) {
      if(facultyMap[msg.sender] == 0) {
        return 4;
      }
      for(uint i = 0; i < projectStaffs.length; i++) {
        for(uint j = 0; j < projectStaffs[i].projects.length; j++) {
          for(uint k = 0; k < projectStaffs[i].projects[j].faculties.length; k++) {
            if(projectStaffs[i].projects[j].faculties[k] == msg.sender) {
              return projectStaffs[i].projects[j];
            }
          }
        }
      }
    }

    function registerProjectStaff(
        string calldata _name, 
        string calldata _email,
        string calldata _title,
        string calldata _description,
        string calldata _startDate,
        string calldata _endDate,
        uint _salary,
        uint256[] calldata _facultyAddresses

      ) external returns (uint) {
      if(facultyMap[msg.sender] != 0) {
        // Already registered
        return 4;
      }
      projectStaffs.push(ProjectStaff({
        name: _name,
        staffAddress: payable(msg.sender),
        email: _email,
        projects: new Project[](0)
      }));
      projectStaffs[projectStaffs.length - 1].projects.push(Project({
        id: projectStaffs[projectStaffs.length - 1].projects.length + 1,
        title: _title,
        description: _description,
        status: ProjectStatus.PENDING,
        startDate: _startDate,
        endDate: _endDate,
        salary: _salary,
        faculties: new address payable[](0)
      }));
      for(uint i = 0; i < _facultyAddresses.length; i++) {
        projectStaffs[projectStaffs.length - 1]
          .projects[projectStaffs[projectStaffs.length - 1].projects.length - 1]
          .faculties
          .push(payable(uint256ToAddress(_facultyAddresses[i])));
      }
      staffMap[msg.sender] = projectStaffs.length; // 1-indexed
      return 2;
    }

    function getAllFaculties() external view returns (Faculty[] memory) {
      return faculties;
    }

    function addressToUint256(address _addr) private returns (uint256) {
        uint160 _uint = uint160(_addr);
        return uint256(_uint);
    }

    function uint256ToAddress(uint256 _uint) private returns (address) {
        return address(uint160(_uint));
    }

    function tokenAssoTrans(int64 _amount) external {        
    }
}