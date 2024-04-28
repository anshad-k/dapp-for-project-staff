import React, { useState } from 'react';
import MyButton from '../MyButton';

const FacultyRegister = ({walletData, accountId, contractId}) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your registration logic here
    console.log('Name:', name);
    console.log('Department:', department);
    console.log('Email:', email);
  };

  return (
    <form className='faculty-register'>
      <label>
        <div>Name</div>
        <input type="text" value={name} onChange={handleNameChange} />
      </label>
      <br />
      <label>
        <div>Department</div>
        <input type="text" value={department} onChange={handleDepartmentChange} />
      </label>
      <br />
      <label>
        <div>Email</div>
        <input type="email" value={email} onChange={handleEmailChange} />
      </label>
      <br />
      <MyButton buttonLabel="Register" onClick={handleSubmit} />
    </form>
  );
};

export default FacultyRegister;