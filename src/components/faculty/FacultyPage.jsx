import React, { useState } from 'react';
import MyGroup from '../MyGroup';
import './FacultyPage.css';
import MyLog from '../MyLog';
import { ProjectStatus } from '../../utils';
import FacultyRegister from './FacultyRegister';
import { fetchProjectStaffs, fetchProjects } from '../hedera/contractQueries';
import { approveProject } from '../hedera/contractUtils';

const FacultyPage = ({walletData, accountId, contractId, setPage, isRegistered, setIsRegistered}) => {
  const [logText, setLogText] = useState("Welcome IITM Faculty...");
  const [projects, setProjects] = useState([]);
  const [projectStaffs, setProjectStaffs] = useState([]);

  const fetchData = async () => {
    if(!contractId) {
      setLogText("No contracts deployed ...");
      return;
    }
    setProjects((await fetchProjects(walletData, accountId, contractId, false).catch((e) => {
      setLogText("Error fetching projects ...");
      return [];
    })));
    setProjectStaffs((await fetchProjectStaffs(walletData, accountId, contractId).catch((e) => {
      setLogText("Error fetching project staffs ...");
      return [];
    })));
  };

  const approveSelectedProject = async (projectId, approval) => {
    if(!contractId) {
      setLogText("No contracts deployed ...");
      return;
    }
    const success = await approveProject(walletData, accountId, contractId, projectId, approval).catch((e) => false);
    if(success) {
      setLogText(`Project ${projectId} ${approval ? 'approved' : 'rejected'}...`);
    } else {
      setLogText(`Error approving project ${projectId}...`);
    }
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
        {isRegistered ? <div className='body'>
          <div className='section'>
            <h2>Pending Projects</h2>
            <ul>
              {projects
                .filter((project) => project.status === ProjectStatus.PENDING)
                .map((project) => (
                <li key={project.id}>{project.title}</li>
              ))}
            </ul>
          </div>
          <div className='section'>
            <h2>Extension Requests</h2>
            <ul>
            {projects
                .filter((project) => project.status === ProjectStatus.EXTENSION)
                .map((project) => (
                <li key={project.id}>{project.title}</li>
              ))}
            </ul>
          </div>
        </div>
        : 
        <div className='body'>
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
        </div>
        }
        
        {/* <div className='section' style={{visibility: isRegistered ? 'visible' : 'hidden'}}>
          <h2>Search Projects</h2>
          <SearchProjects projects={projects} />
        </div> */}
  </div>);
};

export default FacultyPage;