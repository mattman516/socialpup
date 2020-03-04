import { put, select, takeLatest } from 'redux-saga/effects';
import { API, graphqlOperation } from 'aws-amplify';
import { makeSelectAuthState } from '../App/selectors';
import { getUserInfo } from '../../../src/graphql/queries';
import { CREATE_USER } from './constants';
import { createUserInfo } from '../../../src/graphql/mutations';
import { setCurrentUser } from './actions';

export function* processUserCreate(action) {
  console.log('USER CREATE START', action);
  const initUser = {
    id: action.data.attributes.sub,
    publicity: 'public',
    following: [],
    owner: action.data.username,
  }
  let foundUser = yield API.graphql(
    graphqlOperation(getUserInfo, { id: action.data.attributes.sub }),
  );
  foundUser = foundUser.data.getUserInfo;
  if (!foundUser) {
    console.log('createuserinfo');
    foundUser = yield API.graphql(
      graphqlOperation(createUserInfo, { input: initUser }),
    );
    foundUser = foundUser.data.getUserInfo;
    console.log('USER CREATE SUCCESS', foundUser);
  }
  yield put(setCurrentUser(foundUser))
}

function* appSaga() {
  yield takeLatest(CREATE_USER, processUserCreate);
}
export default appSaga;
