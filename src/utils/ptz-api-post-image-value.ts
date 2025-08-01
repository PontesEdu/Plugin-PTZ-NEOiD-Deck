

export function apiBasePtzPostImageValue(cam: any, globals: any) {
  const cameraIP = globals[`${cam}_ip`]; 

  const apiBase = `http://${cameraIP}/cgi-bin/ptzctrl.cgi?post_image_value`;

  return apiBase
}