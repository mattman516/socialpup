import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeSelectWalkList } from '../MapPage/selectors';
import { toggleCreateWalkModal } from '../CreateWalk/actions';
import { FaUndo, FaTrash } from 'react-icons/fa';
import moment from 'moment';
import IconButton from '../../components/IconButton'

export default function AddFollowers() {
  const dispatch = useDispatch();
  const walkList = useSelector(makeSelectWalkList());

  const handleRedoWalk = (walk) => {

    dispatch(toggleCreateWalkModal());
  }

  return (
    <React.Fragment>
      <Wrapper>
        {walkList.length !== 0 && (
          <h3>Previous Walks</h3>
        )}
        {walkList.map(walk => {
          return (
            <React.Fragment>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h6>{walk.name}</h6>
                  <p>{getDate(walk.walkEnds)}</p>
                </div>
                <div style={{ display: 'flex' }}>
                  <IconButton><FaTrash/></IconButton>
                  <IconButton onClick={handleRedoWalk} ><FaUndo/></IconButton>
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
      style={{
        position: 'absolute',
        padding: 20,
        zIndex: 3,
        top: 'calc(100vh - 100px)',
        backgroundColor: 'white',
        paddingTop: 20,
        width: '100vw',
      }}
    >
      <div
        style={{ 
          margin: 'auto',
          maxWidth: 1000,
        }}
        {...props}
      />
    </div>
  )
}