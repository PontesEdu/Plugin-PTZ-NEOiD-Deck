

export function apiBaseCMD(cam: any, globals: any) {
  const cameraIP = globals[`${cam}_ip`]; 

  const apiBase = `http://${cameraIP}/cgi-bin/ptzctrl.cgi?ptzcmd`;

  return apiBase
}



