import { hex2num, hex2str } from "../../utils";

export function decodeFacultyData(result_data) {
  if(result_data.substring(0, 2) === '0x') {
    result_data = result_data.substring(2);
  }
  const faculties = [];
  for(let i = 128; i < result_data.length; i += 128) {
    faculties.push({
      id: hex2num(result_data.substring(i, i + 64)),
      name: hex2str(result_data.substring(i + 64, i + 128))
    });
  }
  return faculties;
}

export function decodeProjectStaffData(result_data) {
  if(result_data.substring(0, 2) === '0x') {
    result_data = result_data.substring(2);
  }
  const projectStaffs = [];
  for(let i = 128; i < result_data.length; i += 192) {
    projectStaffs.push({
      id: hex2num(result_data.substring(i, i + 64)),
      name: hex2str(result_data.substring(i + 64, i + 128)),
      accountId: "0.0." + hex2num(result_data.substring(i + 128, i + 192)),
    });
  }
  return projectStaffs;
}

export function decodeProjectData(result_data) {
  if(result_data.substring(0, 2) === '0x') {
    result_data = result_data.substring(2);
  }
  const projects = [];
  for(let i = 128; i < result_data.length; i += 512) {
    projects.push({
      id: hex2num(result_data.substring(i, i + 64)),
      title: hex2str(result_data.substring(i + 64, i + 128)),
      description: hex2str(result_data.substring(i + 128, i + 192)),
      status: hex2num(result_data.substring(i + 192, i + 256)),
      startDate: hex2num(result_data.substring(i + 256, i + 320)),
      endDate: hex2num(result_data.substring(i + 320, i + 384)),
      salary: hex2num(result_data.substring(i + 384, i + 448)),
      staffAccountId: "0.0." + hex2num(result_data.substring(i + 448, i + 512)),
    });
  }
  return projects;
}