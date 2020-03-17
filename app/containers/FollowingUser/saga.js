import { put, select, takeLatest } from 'redux-saga/effects';
import { API, graphqlOperation } from 'aws-amplify';
import { makeSelectCurrentUser } from '../App/selectors';
import { UNFOLLOW_USER } from './constants';
import { setCurrentUser } from '../App/actions';
import { updateUserInfo } from '../../../src/graphql/mutations';

export function* processUnfollowUser(action) {
  console.log('processAddFollower', action);
  const currentUser = yield select(makeSelectCurrentUser());
  currentUser.following = currentUser.following.filter(username => username !== action.data);
  const returnedUser = yield API.graphql(
    graphqlOperation(updateUserInfo, { input: currentUser }),
  );
  yield put(setCurrentUser(returnedUser.data.updateUserInfo));
}

function* followersSaga() {
  yield takeLatest(UNFOLLOW_USER, processUnfollowUser);
}
export default followersSaga;
