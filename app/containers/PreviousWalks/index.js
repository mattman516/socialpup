import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeSelectWalkList, makeSelectListVisible } from '../MapPage/selectors';
import { toggleCreateWalkModal } from '../CreateWalk/actions';
import { FaUndo, FaTrash, FaSearch } from 'react-icons/fa';
import moment from 'moment';
import IconButton from '../../components/IconButton'
import { setLatLng, setListVisible } from '../MapPage/actions';

export default function AddFollowers() {
  const dispatch = useDispatch();
  const walkList = useSelector(makeSelectWalkList());
  const listVisible = useSelector(makeSelectListVisible());

  const handleRedoWalk = (walk) => () => {
    dispatch(toggleCreateWalkModal(walk));
  }
  const handleWalkClick = (walk) => () => {
    dispatch(setLatLng([walk.latitude, walk.longitude]))
  }
  const handleDeleteWalk = (walk) => () => {
    // dispatch(setLatLng([walk.latitude, walk.longitude]))
  }
  const handlePreviewWalk = (walk) => () => {
    console.log('click');
    dispatch(setListVisible());
    handleWalkClick(walk)();
    // dispatch(setLatLng([walk.latitude, walk.longitude]));
  }

  return (
    <React.Fragment>
      <Wrapper listVisible={listVisible}>
        {walkList.length !== 0 && (
          <h3>Previous Walks</h3>
        )}
        {walkList.map(walk => {
          return (
            <React.Fragment key={walk.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div onClick={handleWalkClick(walk)}>
                  <h6>{walk.name}</h6>
                  <p>{getDate(walk.walkEnds)}</p>
                </div>
                <div style={{ display: 'flex' }}>
                  <IconButton onClick={handlePreviewWalk(walk)}><FaSearch/></IconButton>
                  <IconButton onClick={handleDeleteWalk(walk)}><FaTrash/></IconButton>
                  <IconButton onClick={handleRedoWalk(walk)} ><FaUndo/></IconButton>
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
        zIndex: props.listVisible ? 3 : -1,
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