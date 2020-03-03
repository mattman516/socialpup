import { put, select, takeLatest } from 'redux-saga/effects';
import { API, graphqlOperation } from 'aws-amplify';
import { makeSelectAuthState } from '../App/selectors';
import { getUserInfo } from '../../../src/graphql/queries';
import { FETCH_USER } from './constants';
import { setUserData } from './actions';

export function* processesUserFetch() {
  const authState = yield select(makeSelectAuthState());
  console.log('fetchUser', authState);
  if (authState.userData.attributes.sub) {
    const currUser = yield API.graphql(
      graphqlOperation(getUserInfo, { id: authState.userData.attributes.sub }),
    );
    console.log('currUser', currUser);
    yield put(setUserData(currUser));
  }
}

function* followersSaga() {
  yield takeLatest(FETCH_USER, processesUserFetch);
}
export default followersSaga;
