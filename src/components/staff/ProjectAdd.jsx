import React, { useState } from 'react';
import MyGroup from '../MyGroup';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { addProject } from '../hedera/contractUtils';

const ProjectAdd = ({walletData, accountId, contractId, faculties, projectStaffs, setLogText}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salary, setSalary] = useState(0);
  const [facultyIds, setFacultyIds] = useState([1, 2]);
  const [projectStaffIds, setProjectStaffIds] = useState([1]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  }

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  }

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  }

  const handleSalaryChange = (e) => {
    setSalary(e.target.value);
  }

  const handleAddProjectStaff= (staffId) => {
    setProjectStaffIds((prevIds) => [...prevIds, staffId]);
  }

  const handleAddfaculty = (facultyId) => {
    setFacultyIds((prevIds) => [...prevIds, facultyId]);
  }


  const handleRemoveFaculty = (e) => {
    setFacultyIds((prevIds) => prevIds.filter((id) => id !== e.target.key));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!contractId) {
      setLogText("No contracts deployed ...");
      return;
    }
    const success = await addProject(walletData, accountId, contractId, {
      title,
      description,
      startDate: Number(new Date(startDate).getTime()) / 1000,
      endDate: Number(new Date(endDate).getTime()) / 1000,
      salary: Number(salary),
      staffIds: projectStaffIds,
      facultyIds: facultyIds
    }).catch((e) => false);
    if(success) {
      setLogText(`Project ${title} added...`);
    } else {
      setLogText(`Error adding project ${title}...`);
    }
    
  };

  return (
    <div className='faculty-register'>
      <label>
        <div>Title</div>
        <input type="text" value={title} onChange={handleTitleChange} />
      </label>
      <label>
        <div>Description</div>
        <input type="email" value={description} onChange={handleDescriptionChange} />
      </label>
      <label>
        <div>{`Start date (DD-MM-YYYY)`}</div>
        <input type="text" value={startDate} onChange={handleStartDateChange} />
      </label>
      <label>
        <div>{`End date (DD-MM-YYYY)`}</div>
        <input type="text" value={endDate} onChange={handleEndDateChange} />
      </label>
      <label>
        <div>Salary (tinybars)</div>
        <input type="text" value={salary} onChange={handleSalaryChange} />
      </label>
      {/* <label>
        <div>Project Members</div>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          className='staff-autocomplete'
          options={projectStaffs.map((staff, idx) => staff.name)}
          // options={faculties.map((faculty, idx) => 
          // <div 
          //   key={idx}
          //   onClick={handleAddfaculty}
          // >
          //   {faculty.name}
          // </div>)}
          sx={{ width: 500 }}
          renderInput={(params) => <TextField {...params} label="Project members" />}
        />
      </label>
      <label>
        <div>Faculties</div>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          className='faculty-autocomplete'
          options={faculties.map((faculty, idx) => faculty.name)}
          // options={faculties.map((faculty, idx) => 
          // <div 
          //   key={idx}
          //   onClick={handleAddfaculty}
          // >
          //   {faculty.name}
          // </div>)}
          sx={{ width: 500 }}
          renderInput={(params) => <TextField {...params} label="Faculties" />}
        />
      </label> */}
      {/* <ul>
        {facultyIds.map((facultyId) => (
          <li key={facultyId}>{faculties[facultyId].name} <span key={facultyId} onClick={handleRemoveFaculty}>❌</span></li>
        ))}
      </ul> */}
      <MyGroup buttonLabel="Register" fcn={handleSubmit} />
    </div>
  );
};

export default ProjectAdd;