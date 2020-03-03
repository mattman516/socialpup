import { put, select, takeLatest } from 'redux-saga/effects';
import { API, graphqlOperation } from 'aws-amplify';
import { makeSelectAuthState } from '../App/selectors';
import { createWalk, deleteWalk } from '../../../src/graphql/mutations';
import { listWalks } from '../../../src/graphql/queries';
import { SET_WALK, FETCH_WALKS, DELETE_WALK } from './constants';
import { setWalkList, fetchWalks } from './actions';

export function* processSaveWalk(action) {
  const authState = yield select(makeSelectAuthState());
  let walk = {};
  console.log('WALK', action);

  if (authState.userData.attributes.sub) {
    walk = {
      walkEnds: new Date(),
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
}
export function* processFetchWalks() {
  let walkList = [];
  let mappedWalkList = [];
  const authState = yield select(makeSelectAuthState());
  console.log(authState);
  if (authState.userData.username) {
    walkList = yield API.graphql(
      graphqlOperation(listWalks, {
        filter: { owner: { eq: authState.userData.username } },
      }),
    );
    mappedWalkList = walkList.data.listWalks.items.map(walk => ({
      ...walk,
      latitude: parseFloat(walk.latitude),
      longitude: parseFloat(walk.longitude),
    }));
    console.log('FETCH WALKS SAGA', mappedWalkList);
  }
  yield put(setWalkList(mappedWalkList));
}

function* mapSaga() {
  yield takeLatest(SET_WALK, processSaveWalk);
  yield takeLatest(FETCH_WALKS, processFetchWalks);
  yield takeLatest(DELETE_WALK, processDeleteWalk);
}
export default mapSaga;
