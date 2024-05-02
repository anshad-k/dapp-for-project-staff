import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import './SearchProjects.css';

const SearchProjects = ({projects}) => {
  const [selectedProjectId, setSelectedProjectId] = useState(-1);

  return (
    <div className='search'>
      <label>
        <div>Project Title</div>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          className='faculty-autocomplete'
          options={projects.map((project, idx) => project.title)}
          // options={faculties.map((faculty, idx) => 
          // <div 
          //   key={idx}
          //   onClick={() => setSelectedProjectId(idx)}
          // >
          //   {faculty.name}
          // </div>)}
          sx={{ width: 500 }}
          renderInput={(params) => <TextField {...params} label="SearchProjects" />}
        />
      </label>
      <div className='project'>
        {
          selectedProjectId >= 0 && selectedProjectId < projects.length && (
            <div>
              <div>{`Title: ${projects[selectedProjectId].title}`}</div>
              <div>{`Description: ${projects[selectedProjectId].description}`}</div>
              <div>{`Start date: ${projects[selectedProjectId].startDate}`}</div>
              <div>{`End date: ${projects[selectedProjectId].endDate}`}</div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default SearchProjects;