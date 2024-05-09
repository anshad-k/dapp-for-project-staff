import React, { useState } from 'react';
import MyGroup from '../MyGroup';
import './AdminPage.css';
import MyLog from '../MyLog';
import { fetchProjects } from '../hedera/contractQueries';
import { contractId } from '../../contracts/contractId';
import { paySalary } from '../hedera/contractUtils';
import MyButton from '../MyButton';

const AdminPage = ({walletData, accountId, setPage}) => {
  const [logText, setLogText] = useState("Welcome admin...");
  const [projects, setProjects] = useState([]);


  const fetchData = async () => {
    if(!contractId) {
      setLogText("No contracts deployed ...");
      return;
    }
    setProjects((await fetchProjects(walletData, accountId, contractId, true).catch((e) => {
      setLogText("Error fetching projects ...");
      return [];
    })));
  };

  const makePayment = async (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    const success = await paySalary(walletData, accountId, project.staffAccountId, project.salary).catch((e) => false);
    if(success) {
      setLogText(`Payment made to project ${projectId}...`);
    }
    else {
      setLogText(`Error making payment to project ${projectId}...`);
    }
  }


  return (
    <div className='admin'>
      <nav className='navbar'>
        <h1>Admin Page</h1>
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
          <h2>Projects</h2>
          <ul>
            {projects.map((project) => (
              <li key={project.id} className='list-element'>
                <span>{project.title + ":  "}</span>
                <span>{project.description}</span>
                {project.endDate <= ((new Date().getTime()) / 1000) && <MyButton fcn={() => makePayment(project.id)} buttonLabel='Pay'/>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;