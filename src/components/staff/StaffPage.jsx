import React, { useState } from 'react';
import MyGroup from '../MyGroup';
import './StaffPage.css';
import MyLog from '../MyLog';
import StaffRegister from './StaffRegister';
import { fetchFaculties, fetchProjectStaffs, fetchProjects } from '../hedera/contractQueries';
import ProjectAdd from './ProjectAdd';
import SearchProjects from '../search/SearchProjects';

const StaffPage = ({walletData, accountId, contractId, setPage, isRegistered, setIsRegistered}) => {
  const [logText, setLogText] = useState("Welcome project satff...");
  const [projects, setProjects] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [projectStaffs, setProjectStaffs] = useState([]);
  const [search, setSearch] = useState(true);

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
    setFaculties((await fetchFaculties(walletData, accountId, contractId).catch((e) => {
      setLogText("Error fetching faculties ...");
      return [];
    })));
  };


  return (
    <div className='staff'>
      <nav className='navbar'>
        <h1>Project Staff Page</h1>
        <MyGroup 
          fcn={() => setSearch(false)}
          buttonLabel={`Add Project`}  
        />
        <MyGroup 
          fcn={() => setSearch(true)}
          buttonLabel={`Search Project`}  
        />
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
          <h2>Your Projects</h2>
          <ul>
            {projects
              .map((project) => (
              <li key={project.id}>{project.name}</li>
            ))}
          </ul>
        </div>
        : <div className='section'>
            <StaffRegister 
              walletData={walletData}
              accountId={accountId} 
              contractId={contractId} 
              setIsRegistered={setIsRegistered} 
              setLogText={setLogText} 
            />
          </div>
        }
        
        {search ? <div className='section' style={{visibility: isRegistered ? 'visible' : 'hidden'}}>
          <h2>Search Projects</h2>
          <SearchProjects projects={projects} />
        </div>
        :
        <div className='section' style={{visibility: isRegistered ? 'visible' : 'hidden'}}>
          <ProjectAdd 
            walletData={walletData} 
            accountId={accountId} 
            contractId={contractId} 
            faculties={faculties}
            projectStaffs={projectStaffs}
            setLogText={setLogText} 
          />
        </div>
        }
      </div>
    </div>
  );
};

export default StaffPage;