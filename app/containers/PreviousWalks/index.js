import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeSelectWalkList } from '../MapPage/selectors';
import moment from 'moment';

export default function AddFollowers() {
  const walkList = useSelector(makeSelectWalkList());
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', zIndex: 3, top: 'calc(100vh - 100px)', height: 300, width: '100vw', backgroundColor: 'white', paddingTop: 20 }}>
        {walkList.map(walk => {
          return (
            <div style={{ maxWidth: 1000, margin: 'auto' }}>
              <h6>{walk.name}</h6>
              <p>{getDate(walk.walkEnds)}</p>
            </div>
          )
        })}
        {walkList.length === 0 && (
          <div style={{ width: 300, height: 300, display: 'flex', margin: 'auto', color: 'SlateGrey' }}>
            <p style={{ color: 'light-grey' }}>Click on the map to create your first walk!</p>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
const getDate = (time) => {
  return moment.unix(time).format("MMM DD YYYY hh:mm a");
}