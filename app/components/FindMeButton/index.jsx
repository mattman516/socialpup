import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { FaGlobe } from 'react-icons/fa';

export default ({ handleSetCurrentLocation, positionLoad }) => {
    
    return (
        <Button
          type="button"
          onClick={handleSetCurrentLocation}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          {positionLoad ?
            <Spinner animation="grow" style={{ height: 15, width: 15 }}/> :
            <FaGlobe />
          }
          Find Me
        </Button>
    )
}