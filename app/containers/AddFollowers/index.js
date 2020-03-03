import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { fetchUser } from './actions';
import 'mapbox-gl/dist/mapbox-gl.css';
import saga from './saga';
import reducer from './reducer';
import { makeSelectAuthState } from '../App/selectors';

export default function AddFollowers() {
  const dispatch = useDispatch();
  const authState = useSelector(makeSelectAuthState());
  useInjectSaga({ key: 'followers', saga });
  useInjectReducer({ key: 'followers', reducer });

  React.useEffect(() => {
    dispatch(fetchUser());
  }, [authState.userData.userName]);

  return (
    <React.Fragment>
        <Button type="button">
            Following
        </Button>
    </React.Fragment>
  );
}