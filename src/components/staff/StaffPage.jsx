import React, { useState } from 'react';
import MyGroup from '../MyGroup';
import getProjectDetailsFcn from '../hedera/getProjectDetails';
import './StaffPage.css';
import MyLog from '../MyLog';
import getFacultyDetailsFcn from '../hedera/getFacultyDetails';

const StaffPage = ({walletData, accountId, contractId, setPage}) => {
  const [logText, setLogText] = useState("Welcome project satff...");
  const [projects, setProjects] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const fetchData = async () => {
    if(!contractId) {
      setLogText("No contracts deployed ...");
      return;
    }
    setProjects((await getProjectDetailsFcn(walletData, accountId, contractId)));
    setFaculties((await getFacultyDetailsFcn(walletData, accountId, contractId)));
  };

  return (
    <div className='staff'>
      <nav className='navbar'>
        <h1>Faculty Page</h1>
        <MyGroup 
          fcn={fetchData}
          buttonLabel={"Fetch Data"}  
        />
        <MyGroup 
          fcn={() => setPage("home")}
          buttonLabel={`🏠︎ Home`}  
        />
      </nav>
      <MyLog message={logText} />
      <div className='body'>
        <div className='section'>
          <h2>Your Projects</h2>
          <ul>
            {projects
              .map((project) => (
              <li key={project.id}>{project.name}</li>
            ))}
          </ul>
        </div>
        
        <div className='section'>
          <h2>Search Projects</h2>
        </div>
      </div>
    </div>
  );
};

export default StaffPage;