import React from 'react';
import { useSelector } from 'react-redux';
import { makeSelectWalkList } from '../MapPage/selectors';
import { FaUndo, FaTrash } from 'react-icons/fa';
import moment from 'moment';
import IconButton from '../../components/IconButton'

export default function AddFollowers() {
  const walkList = useSelector(makeSelectWalkList());
  return (
    <React.Fragment>
      <Wrapper>
        {walkList.length !== 0 && (
          <h3>Previous Walks</h3>
        )}
        {walkList.map(walk => {
          return (
            <React.Fragment>
              <div style={{ maxWidth: 1000, margin: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h6>{walk.name}</h6>
                  <p>{getDate(walk.walkEnds)}</p>
                </div>
                <div style={{ display: 'flex' }}>
                  <IconButton><FaTrash/></IconButton>
                  <IconButton><FaUndo/></IconButton>
                </div>
              </div>
              <hr/>
            </React.Fragment>
          )
        })}
        {walkList.length === 0 && (
          <div style={{ width: 300, height: 300, display: 'flex', margin: 'auto', color: 'SlateGrey' }}>
            <p style={{ color: 'light-grey' }}>Click on the map to create your first walk!</p>
          </div>
        )}
      </Wrapper>
    </React.Fragment>
  );
}
const getDate = (time) => {
  return moment.unix(time).format("MMM DD YYYY hh:mm a");
}

const Wrapper = props => {
  return (
    <div
      {...props}
      style={{
        position: 'absolute',
        padding: 20,
        zIndex: 3,
        top: 'calc(100vh - 100px)',
        width: '100vw',
        backgroundColor: 'white',
        paddingTop: 20,
      }}
    />
  )
}