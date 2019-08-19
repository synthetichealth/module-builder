import React, {useMemo} from 'react';
import {useDropzone} from 'react-dropzone';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '25px',
  borderWidth: 2,
  borderRadius: '5px',
  marginBottom: '15px',
  borderColor: '#666666',
  borderStyle: 'dashed',
  backgroundColor: '#ffffff',
  outline: 'none',
  transition: 'border .15s ease-in-out'
};

const activeStyle = {
  borderColor: '#336699',
  backgroundColor: '#dceaef',
  color: '#336699'
};

const acceptStyle = {
  borderColor: '#339999',
  cursor: 'hand'
};

const rejectStyle = {
  borderColor: '#ff1744',
  backgroundColor: '#ffeeee',
  cursor: 'no-drop'
};

function StyledDropzone(props) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({accept: 'application/json',onDrop:props.onDrop});

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject
  ]);

  return (
    <div className="LoadModule-dropzone">
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <p>Drop files here or click to open saved modules.</p>
      </div>
    </div>
  );
}

export default StyledDropzone;
