import React, { useState } from 'react';
import MyGroup from '../MyGroup';
import { registerStaffFcn } from '../hedera/contractUtils';

const StaffRegister = ({walletData, accountId, contractId, setIsRegistered, setLogText}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your registration logic here
    const registered = await registerStaffFcn(walletData, accountId, contractId, name, email);
    if(registered) {
      setIsRegistered(true);
    } else {
      setLogText("Registration failed ...");
      setName('');
      setEmail('');
    }
  };

  return (
    <div className='staff-register'>
      <label>
        <div>Name</div>
        <input type="text" value={name} onChange={handleNameChange} />
      </label>
      <label>
        <div>Email</div>
        <input type="email" value={email} onChange={handleEmailChange} />
      </label>
      <MyGroup buttonLabel="Register" fcn={handleSubmit} />
    </div>
  );
};

export default StaffRegister;