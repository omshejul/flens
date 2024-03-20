import React from 'react';

interface CameraProps {
  fill?: string; 
  size?: number;
}

const Camera: React.FC<CameraProps> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"width={props.size ? props.size : "24"} height={props.size ? props.size : "24"} fill={props.fill ? props.fill : "#fff"} viewBox="0 -960 960 960"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
  )
}

export default Camera;