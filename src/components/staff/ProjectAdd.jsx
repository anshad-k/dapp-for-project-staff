import React, { useState } from 'react';
import MyGroup from '../MyGroup';
import { addProject } from '../hedera/contractUtils';

const ProjectAdd = ({walletData, accountId, contractId, faculties, setLogText}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salary, setSalary] = useState(0);
  const [facultyIds, setFacultyIds] = useState([]);
  // const [projectStaffIds, setProjectStaffIds] = useState([1]);

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

  const handleAddfaculty = (facultyId) => {
    setFacultyIds((prevIds) => {
      if(prevIds.includes(facultyId)) {
        return prevIds;
      }
      return [...prevIds, facultyId];
    });
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
      staffIds: [1],
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
      <label>
        <div>Faculties</div>
        <ul>
          {faculties
          .filter(faculty => !facultyIds.includes(faculty.id))
          .map((faculty, idx) => (
            <li key={idx} className='list-item'>
              <span>{faculty.name}</span>
              <button onClick={() => handleAddfaculty(faculty.id)}>Add</button>
            </li>     
          ))}
        </ul>
      </label>
      <MyGroup buttonLabel="Register" fcn={handleSubmit} />
    </div>
  );
};

export default ProjectAdd;