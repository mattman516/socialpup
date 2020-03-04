import { put, select, takeLatest } from 'redux-saga/effects';
import { API, graphqlOperation } from 'aws-amplify';
import { makeSelectAuthState, makeSelectCurrentUser } from '../App/selectors';
import { listUserInfos } from '../../../src/graphql/queries';
import { FETCH_USER_LIST, ADD_FOLLOWER } from './constants';
import { setUserList } from './actions';
import { updateUserInfo } from '../../../src/graphql/mutations';

export function* processAllUserFetch() {
  console.log('FETCH_ALL_BEGIN');
  const authState = yield select(makeSelectAuthState());
  const currentUser = yield select(makeSelectCurrentUser());
  console.log('fetchAllUsers', authState, currentUser);
  if (authState.authUserData.attributes.sub) {
    const allUsers = yield API.graphql(
      graphqlOperation(listUserInfos),
    );

    let otherUsers = allUsers.data.listUserInfos.items;
    otherUsers = otherUsers.filter(u => u.owner !== currentUser.owner && !currentUser.following.includes(u.owner));
    yield put(setUserList(otherUsers));
  }
}

export function* processAddFollower(action) {
  console.log('processAddFollower', action);
  const currentUser = yield select(makeSelectCurrentUser());
  currentUser.following.push(action.data);
  console.log(currentUser);
  yield API.graphql(
    graphqlOperation(updateUserInfo, { input: currentUser }),
  );
}

function* followersSaga() {
  yield takeLatest(FETCH_USER_LIST, processAllUserFetch);
  yield takeLatest(ADD_FOLLOWER, processAddFollower);
}
export default followersSaga;
