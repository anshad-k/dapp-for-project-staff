import React, { useState } from 'react';
import MyGroup from '../MyGroup';
import './AdminPage.css';
import MyLog from '../MyLog';
import { fetchProjectStaffs, fetchProjects } from '../hedera/contractQueries';
import { contractId } from '../../contracts/contractId';

const AdminPage = ({walletData, accountId, setPage}) => {
  const [logText, setLogText] = useState("Welcome admin...");
  const [projects, setProjects] = useState([]);
  const [projectStaffs, setProjectStaffs] = useState([]);


  const fetchData = async () => {
    if(!contractId) {
      setLogText("No contracts deployed ...");
      return;
    }
    setProjects((await fetchProjects(walletData, accountId, contractId, true).catch((e) => {
      setLogText("Error fetching projects ...");
      return [];
    })));
    setProjectStaffs((await fetchProjectStaffs(walletData, accountId, contractId).catch((e) => {
      setLogText("Error fetching project staffs ...");
      return [];
    })));
  };

  const completePayment = async () => {
    if(!contractId) {
      setLogText("No contracts deployed ...");
      return;
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
          fcn={completePayment}
          buttonLabel={`Initiate Payments`}  
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
              <li key={project.id}>{project.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;