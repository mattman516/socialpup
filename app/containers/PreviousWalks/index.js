import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeSelectWalkList } from '../MapPage/selectors';
import moment from 'moment';

export default function AddFollowers() {
  const walkList = useSelector(makeSelectWalkList());
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', zIndex: 3, top: 'calc(100vh - 100px)', height: 300, width: '100vw', backgroundColor: 'white', }}>
        {walkList.map(walk => {
          return (
            <div>
              <p>{walk.name}</p>
              <p>{getDate(walk.walkEnds)}</p>
            </div>
          )
        })}
      </div>
    </React.Fragment>
  );
}
const getDate = (time) => {
  return moment.unix(time).format("DD MMM YYYY hh:mm a");
}