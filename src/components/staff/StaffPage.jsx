import React, { useEffect, useState } from 'react';
import MyGroup from '../MyGroup';
import getProjectDetailsFcn from '../hedera/getProjectDetails';
import './StaffPage.css';
import MyLog from '../MyLog';
import getFacultyDetailsFcn from '../hedera/getFacultyDetails';
import StaffRegister from './StaffRegister';
import { isRegisteredFcn } from '../hedera/contractUtils';
import ProjectAdd from './ProjectAdd';
import SearchProjects from '../search/SearchProjects';

const StaffPage = ({walletData, accountId, contractId, setPage}) => {
  const [logText, setLogText] = useState("Welcome project satff...");
  const [projects, setProjects] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [search, setSearch] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  const fetchData = async () => {
    if(!contractId) {
      setLogText("No contracts deployed ...");
      return;
    }
    setProjects((await getProjectDetailsFcn(walletData, accountId, contractId)));
    setFaculties((await getFacultyDetailsFcn(walletData, accountId, contractId)));
  };

  
  useEffect(() => {
    const checkingRegitration = async () => {
      if(!contractId) {
        setLogText("No contracts deployed ...");
        return;
      }
      console.log('Checking registration...');
      setIsRegistered(await isRegisteredFcn(walletData, accountId, contractId, false));
      // setIsRegistered(true);
    }
    checkingRegitration();
  }, []);

  return (
    <div className='staff'>
      <nav className='navbar'>
        <h1>Faculty Page</h1>
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
            setLogText={setLogText} 
          />
        </div>
        }
      </div>
    </div>
  );
};

export default StaffPage;