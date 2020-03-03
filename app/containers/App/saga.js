import { put, select, takeLatest } from 'redux-saga/effects';
import { API, graphqlOperation } from 'aws-amplify';
import { makeSelectAuthState } from '../App/selectors';
import { getUserInfo } from '../../../src/graphql/queries';
import { CREATE_USER } from './constants';
import { createUserInfo } from '../../../src/graphql/mutations';

export function* processUserCreate(action) {
  console.log('USER CREATE START', action);
  const initUser = {
    id: action.data.attributes.sub,
    publicity: 'public',
    following: [],
    owner: action.data.username,
  }
  const testUser = yield API.graphql(
    graphqlOperation(getUserInfo, { id: action.data.attributes.sub }),
  );
  console.log('TESTUSER', testUser.data.getUserInfo);
  if (!testUser.data.getUserInfo) {
    console.log('createuserinfo');
    const currUser = yield API.graphql(
      graphqlOperation(createUserInfo, { input: initUser }),
    );
    console.log('USER CREATE SUCCESS', currUser);
  }
}

function* appSaga() {
  yield takeLatest(CREATE_USER, processUserCreate);
}
export default appSaga;
