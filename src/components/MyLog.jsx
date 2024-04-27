import React from 'react';

const MyLog = ({ message }) => 
<div style={{
  fontSize: "1.5em",
  padding: "10px",
  color: "white",
  fontFamily: "monospace",
}}>
  {message}
</div>;

export default MyLog;