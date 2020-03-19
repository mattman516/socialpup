import { put, select, takeLatest, all, call } from 'redux-saga/effects';
import { API, graphqlOperation } from 'aws-amplify';
import { makeSelectAuthState, makeSelectCurrentUser } from '../App/selectors';
import { createWalk, deleteWalk } from '../../../src/graphql/mutations';
import { getWalkByOwner } from '../../../src/GSIGraphql';
import moment from 'moment';
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
  const currUser = yield select(makeSelectCurrentUser());
  const end = getDate(currUser.previousWalkLookback);
  if (authState.authUserData.username) {
    let nextToken; 
    do {
      walkList = yield API.graphql(graphqlOperation(listWalks,
        { nextToken,
          filter: {
            owner: { ne: authState.authUserData.username },
            walkEnds: { gt: end },
          },
        }));
      nextToken = walkList.data.listWalks.nextToken;
      walkList.data.listWalks.items.forEach(walk => {
        mappedWalkList.push({
          ...walk,
          latitude: parseFloat(walk.latitude),
          longitude: parseFloat(walk.longitude),
        });
      });
    }while(nextToken);
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
      currUser.following.map(user => call(grabMappedWalksByUser, user, currUser.previousWalkLookback)),
    );
  }
  let combined = [];
  allCalls.forEach(walks => {
    combined = combined.concat(walks);
  });
  yield put(setOthersWalkList(combined));
}

function* grabMappedWalksByUser(user, history) {
  let mappedWalkList = [];
  let nextToken = '';
  const end = getDate(history);
  do {
    const walkList = yield API.graphql(
      graphqlOperation(getWalkByOwner, { owner: user, endTime: end }),
    );
    walkList.data.ownerEndTime.items.forEach(walk => {
      mappedWalkList.push({
        ...walk,
        latitude: parseFloat(walk.latitude),
        longitude: parseFloat(walk.longitude),
      });
    });
  }while(nextToken);

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

const getDate = history => {
  let allCheck = history === -1 ? -1800000 : -history;
  let timeAdd = parseInt(moment(new Date())
  .add(allCheck, 'm')
  .format('X'), 10);
  return timeAdd;
}
