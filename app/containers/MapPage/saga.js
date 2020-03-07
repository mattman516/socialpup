import { put, select, takeLatest, all, call } from 'redux-saga/effects';
import { API, graphqlOperation } from 'aws-amplify';
import { makeSelectAuthState, makeSelectCurrentUser } from '../App/selectors';
import { createWalk, deleteWalk } from '../../../src/graphql/mutations';
import { getWalkByOwner } from '../../../src/GSIGraphql';
import {
  SET_WALK,
  FETCH_WALKS,
  DELETE_WALK,
  FETCH_ALL_WALKS,
  FETCH_FOLLOWED_WALKS,
} from './constants';
import { setWalkList, fetchWalks, setOthersWalkList } from './actions';
import { listWalks } from '../../../src/graphql/queries';

export function* processSaveWalk(action) {
  const authState = yield select(makeSelectAuthState());
  let walk = {};
  console.log('WALK', action);

  if (authState.authUserData.attributes.sub) {
    walk = {
      name: 'test123',
      description: 'test123',
      ...action.data,
    };

    const currWalk = yield API.graphql(
      graphqlOperation(createWalk, { input: walk }),
    );
    console.log('SAVE WALK SAGA', currWalk);
    yield put(fetchWalks());
  }
}
export function* processDeleteWalk(action) {
  try {
    console.log('DELETE_WALK', action);
    const authState = yield select(makeSelectAuthState());
    let walk = {};
  
    if (authState.loggedIn) {
      walk = {
        ...action.data,
        // userId: authState.userData.attributes.sub,
        name: 'test123',
        description: 'test123',
      };
  
      const currWalk = yield API.graphql(
        graphqlOperation(deleteWalk, { input: { id: walk.id } }),
      );
      console.log('SAVE WALK SAGA', currWalk);
      yield put(fetchWalks());
    }
  } catch (e) {
    console.error('Could not delete');
  }
}
export function* processFetchWalks() {
  let mappedWalkList = [];
  const authState = yield select(makeSelectAuthState());
  if (authState.authUserData.username) {
    mappedWalkList = yield call(
      grabMappedWalksByUser,
      authState.authUserData.username,
    );
  }
  yield put(setWalkList(mappedWalkList));
}
export function* processFetchAllWalks() {
  let walkList = [];
  let mappedWalkList = [];
  const authState = yield select(makeSelectAuthState());
  if (authState.authUserData.username) {
    walkList = yield API.graphql(graphqlOperation(listWalks));
    mappedWalkList = walkList.data.listWalks.items.map(walk => ({
      ...walk,
      latitude: parseFloat(walk.latitude),
      longitude: parseFloat(walk.longitude),
    }));
    console.log('FETCH ALL WALKS', mappedWalkList);
  }
  yield put(setOthersWalkList(mappedWalkList));
}
export function* processFollowedWalks() {
  let allCalls = [];
  const authState = yield select(makeSelectAuthState());
  const currUser = yield select(makeSelectCurrentUser());
  if (authState.authUserData.username && currUser.following) {
    allCalls = yield all(
      currUser.following.map(user => call(grabMappedWalksByUser, user)),
    );
  }
  let combined = [];
  allCalls.forEach(walks => {
    combined = combined.concat(walks);
  });
  yield put(setOthersWalkList(combined));
}

function* grabMappedWalksByUser(user) {
  const walkList = yield API.graphql(
    graphqlOperation(getWalkByOwner, { owner: user }),
  );
  const mappedWalkList = walkList.data.ownerEndTime.items.map(walk => ({
    ...walk,
    latitude: parseFloat(walk.latitude),
    longitude: parseFloat(walk.longitude),
  }));
  return mappedWalkList;
}

function* mapSaga() {
  yield takeLatest(SET_WALK, processSaveWalk);
  yield takeLatest(FETCH_WALKS, processFetchWalks);
  yield takeLatest(DELETE_WALK, processDeleteWalk);
  yield takeLatest(FETCH_ALL_WALKS, processFetchAllWalks);
  yield takeLatest(FETCH_FOLLOWED_WALKS, processFollowedWalks);
}
export default mapSaga;
