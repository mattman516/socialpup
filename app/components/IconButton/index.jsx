import React from 'react';
import Button from 'react-bootstrap/Button';

const IconButton = props => {
    return (
      <Button
        {...props}
        style={{
          height: 30,
          width: 30,
          borderRadius:15,
          padding: 0,
          backgroundColor: 'white',
          color: '#007bff',
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          margin: 3,
          ...props.style
        }}
      />
    )
  }

  export default IconButton;