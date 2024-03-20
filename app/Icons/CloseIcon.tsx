import React from 'react';

interface CameraProps {
  fill?: string; 
  size?: number;
}

const Camera: React.FC<CameraProps> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size ? props.size : "24"} height={props.size ? props.size : "24"} fill={props.fill ? props.fill : "#fff"} viewBox="0 -960 960 960"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
  )
}

export default Camera;