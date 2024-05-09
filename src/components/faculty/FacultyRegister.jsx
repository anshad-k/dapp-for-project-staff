import React, { useState } from 'react';
import MyGroup from '../MyGroup';
import { registerFacultyFcn } from '../hedera/contractUtils';

const FacultyRegister = ({walletData, accountId, contractId, setIsRegistered, setLogText}) => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your registration logic here
    const registered = await registerFacultyFcn(walletData, accountId, contractId, name, department, email).catch((e) => false);
    if(registered) {
      setIsRegistered(true);
    } else {
      setLogText("Registration failed ...");
      setName('');
      setDepartment('');
      setEmail('');
    }
  };

  return (
    <div className='faculty-register'>
      <label>
        <div>Name</div>
        <input type="text" value={name} onChange={handleNameChange} />
      </label>
      <label>
        <div>Email</div>
        <input type="email" value={email} onChange={handleEmailChange} />
      </label>
      <label>
        <div>Department</div>
        <input type="text" value={department} onChange={handleDepartmentChange} />
      </label>
      <MyGroup buttonLabel="Register" fcn={handleSubmit} />
    </div>
  );
};

export default FacultyRegister;