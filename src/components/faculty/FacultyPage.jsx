import React, { useState } from 'react';
import MyGroup from '../MyGroup';
import getProjectDetailsFcn from '../hedera/getProjectDetails';
import './FacultyPage.css';
import MyLog from '../MyLog';
import { ProjectStatus } from '../../utils';
import FacultyRegister from './FacultyRegister';

const FacultyPage = ({walletData, accountId, contractId, setPage}) => {
  const [logText, setLogText] = useState("Welcome IITM Faculty...");
  const [projects, setProjects] = useState([]);

  const fetchData = async () => {
    if(!contractId) {
      setLogText("No contracts deployed ...");
      return;
    }
    setProjects((await getProjectDetailsFcn(walletData, accountId, contractId)));
  };

  return (
    <div className='faculty'>
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
          <h2>Pending Projects</h2>
          <ul>
            {projects
              .filter((project) => project.status === ProjectStatus.PENDING)
              .map((project) => (
              <li key={project.id}>{project.name}</li>
            ))}
          </ul>

          <h2>Extension Requests</h2>
          <ul>
          {projects
              .filter((project) => project.status === ProjectStatus.EXTENSION)
              .map((project) => (
              <li key={project.id}>{project.name}</li>
            ))}
          </ul>
        </div>
        
        <div className='section'>
          <h2>Search Projects</h2>
          <FacultyRegister walletData={walletData} accountId={accountId} contractId={contractId} />
        </div>
      </div>
    </div>
  );
};

export default FacultyPage;