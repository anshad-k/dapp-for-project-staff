import React, { useState } from 'react';
import MyGroup from '../MyGroup';
import contractDeployFcn from '../hedera/contractDeploy';
import getFacultyDetailsFcn from '../hedera/getFacultyDetails';
import getProjectDetailsFcn from '../hedera/getProjectDetails';
import './AdminPage.css';
import makePayments from '../hedera/makePayments';
import MyLog from '../MyLog';
import { isAdmin } from '../hedera/contractUtils';
import {adminContractDeploy, adminContractDelete} from '../../adminContractFncs';

const AdminPage = ({walletData, accountId, setPage}) => {
  const [contractId, setContractId] = useState();
  const [logText, setLogText] = useState("Welcome admin...");
  const [faculties, setFaculties] = useState([]);
  const [projects, setProjects] = useState([]);

  async function contractDeploy() {
		if (contractId !== undefined) {
			setLogText(`You already have contract ${contractId} ✅`);

		} else if(!walletData || !accountId) {
      setLogText("No wallet connected");
      setPage("home");
    }
     else {
      setLogText("Deploying contract ...");
      const [cId, txIdRaw] = await adminContractDeploy();

			setContractId(cId);
			setLogText(`Successfully deployed smart contract with ID: ${cId} ✅`);
      localStorage.setItem("contractId", cId);
		}
	}

  const fetchData = async () => {
    if(!contractId) {
      setLogText("No contracts deployed ...");
      return;
    }
    if(isAdmin(walletData, accountId, contractId)) {
      setLogText("You are admin!!!!!")
    }
    setFaculties((await getFacultyDetailsFcn(walletData, accountId, contractId)));
    setProjects((await getProjectDetailsFcn(walletData, accountId, contractId)));

  };

  const completePayment = async () => {
    if(!contractId) {
      setLogText("No contracts deployed ...");
      return;
    }
    if(makePayments(walletData, accountId, contractId) !== 2) {
      setLogText("Payments failed ...");
    }
  }

  const contractDelete = async () => {
    if(!contractId) {
      setLogText("No contracts deployed ...");
      return;
    }
    await adminContractDelete(contractId);
    setContractId(undefined);
  }

  return (
    <div className='admin'>
      <nav className='navbar'>
        <h1>Admin Page</h1>
        {!contractId &&  <MyGroup
          fcn={contractDeploy}
          buttonLabel={"Deploy Contract"}
        />}
        <MyGroup 
          fcn={fetchData}
          buttonLabel={"Fetch Data"}  
        />
        <MyGroup 
          fcn={completePayment}
          buttonLabel={`Initiate Payments`}  
        />
        <MyGroup 
          fcn={contractDelete}
          buttonLabel={"Delete Contract"} 
        />
        <MyGroup 
          fcn={() => setPage("home")}
          buttonLabel={`🏠︎ Home`}  
        />
      </nav>
      <MyLog message={logText} />
      <div className='body'>
        <div className='section'>
          <h2>Faculties</h2>
          <ul>
            {faculties.map((contract) => (
              <li key={contract.id}>{contract.name}</li>
            ))}
          </ul>
        </div>
        
        <div className='section'>
          <h2>Projects</h2>
          <ul>
            {projects.map((project) => (
              <li key={project.id}>{project.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;