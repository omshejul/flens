import React from 'react';

interface CameraProps {
  fill?: string; 
  size?: number;
}

const Camera: React.FC<CameraProps> = (props) => {
  return (
<svg xmlns="http://www.w3.org/2000/svg" height={props.size ? props.size : "24"} fill={props.fill ? props.fill : "#fff"} viewBox="0 -960 960 960" width={props.size ? props.size : "24"}><path d="M480-320q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Zm0-80ZM200-120q-33 0-56.5-23.5T120-200v-160h80v160h160v80H200Zm400 0v-80h160v-160h80v160q0 33-23.5 56.5T760-120H600ZM120-600v-160q0-33 23.5-56.5T200-840h160v80H200v160h-80Zm640 0v-160H600v-80h160q33 0 56.5 23.5T840-760v160h-80Z"/></svg>
  )
}

export default Camera;