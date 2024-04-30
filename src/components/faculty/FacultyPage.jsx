import React, { useState } from 'react';
import MyGroup from '../MyGroup';
import getProjectDetailsFcn from '../hedera/getProjectDetails';
import './FacultyPage.css';
import MyLog from '../MyLog';
import { ProjectStatus } from '../../utils';
import FacultyRegister from './FacultyRegister';
import { isRegisteredFcn } from '../hedera/contractUtils';
import SearchProjects from '../search/SearchProjects';

const FacultyPage = ({walletData, accountId, contractId, setPage}) => {
  const [logText, setLogText] = useState("Welcome IITM Faculty...");
  const [projects, setProjects] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);

  const fetchData = async () => {
    if(!contractId) {
      setLogText("No contracts deployed ...");
      return;
    }
    setProjects((await getProjectDetailsFcn(walletData, accountId, contractId)));
  };

  const checkingRegitration = async () => {
    if(!contractId) {
      setLogText("No contracts deployed ...");
      return;
    }
    console.log('Checking registration...');
    setIsRegistered(await isRegisteredFcn(walletData, accountId, contractId, true));
  }

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
        {isRegistered ? <div className='section'>
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
        : 
        <div className='section'>
          <h2>Register Faculty</h2>
          <FacultyRegister 
            walletData={walletData} 
            accountId={accountId} 
            contractId={contractId} 
            setIsRegistered={setIsRegistered} 
            setLogText={setLogText} 
          />
        </div>
        }
        
        <div className='section' style={{visibility: isRegistered ? 'visible' : 'hidden'}}>
          <h2>Search Projects</h2>
          <SearchProjects projects={projects} />
        </div>
      </div>
    </div>
  );
};

export default FacultyPage;