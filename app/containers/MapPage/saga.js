import { put, select, takeLatest, all, call, delay } from 'redux-saga/effects';
import { API, graphqlOperation } from 'aws-amplify';
import { makeSelectAuthState, makeSelectCurrentUser } from '../App/selectors';
import { createWalk, deleteWalk } from '../../../src/graphql/mutations';
import { onCreateWalk } from '../../../src/graphql/subscriptions';
import moment from 'moment';
import {
  SET_WALK,
  FETCH_WALKS,
  DELETE_WALK,
  FETCH_ALL_WALKS,
  FETCH_FOLLOWED_WALKS,
  UNSUBSCRIBE_TO_WALKS,
  SUBSCRIBE_TO_WALKS,
} from './constants';
import {
  setWalkList,
  fetchWalks,
  setOthersWalkList,
  subscribeToWalks,
  fetchAllWalks,
} from './actions';
import { listWalks, ownerEndTime } from '../../../src/graphql/queries';

let subscription;
let newWalks = [];
let subscriptionType = '';

export function* processSaveWalk(action) {
  const authState = yield select(makeSelectAuthState());
  let walk = {};

  if (authState.authUserData.attributes.sub) {
    walk = {
      name: 'Default New Walk',
      ...action.data,
    };

    yield API.graphql(graphqlOperation(createWalk, { input: walk }));
    yield put(fetchWalks());
  }
}
export function* processDeleteWalk(action) {
  try {
    const authState = yield select(makeSelectAuthState());

    if (authState.loggedIn) {
      yield API.graphql(
        graphqlOperation(deleteWalk, { input: { id: action.data.id } }),
      );
      yield put(fetchWalks());
    }
  } catch (e) {
    console.error('Could not delete');
  }
}
export function* processFetchWalks() {
  let mappedWalkList = [];
  const authState = yield select(makeSelectAuthState());
  const currUser = yield select(makeSelectCurrentUser());
  if (authState.authUserData.username) {
    mappedWalkList = yield call(
      grabMappedWalksByUser,
      authState.authUserData.username,
      currUser.previousWalkLookback
    );
  }
  yield put(setWalkList(mappedWalkList));
}

export function* processFetchAllWalks() {
  // manage subscriptions
  subscriptionType = 'all';
  let walkList = [];
  yield put(subscribeToWalks());

  // fetch walks
  let mappedWalkList = [];
  const authState = yield select(makeSelectAuthState());
  const currUser = yield select(makeSelectCurrentUser());
  const end = getDate(currUser.previousWalkLookback);
  if (authState.authUserData.username) {
    let nextToken;
    do {
      walkList = yield API.graphql(
        graphqlOperation(listWalks, {
          nextToken,
          filter: {
            owner: { ne: authState.authUserData.username },
            walkEnds: { gt: end },
          },
        }),
      );
      nextToken = walkList.data.listWalks.nextToken;
      walkList.data.listWalks.items.forEach(walk => {
        mappedWalkList.push({
          ...walk,
          latitude: parseFloat(walk.latitude),
          longitude: parseFloat(walk.longitude),
        });
      });
    } while (nextToken);
  }
  yield put(setOthersWalkList(mappedWalkList));
}

export function* processFollowedWalks() {
  // manage subscriptions
  subscriptionType = 'followed';
  newWalks = [];
  yield put(subscribeToWalks());

  // fetch followed walks
  let allCalls = [];
  const authState = yield select(makeSelectAuthState());
  const currUser = yield select(makeSelectCurrentUser());
  if (authState.authUserData.username && currUser.following) {
    allCalls = yield all(
      currUser.following.map(user =>
        call(grabMappedWalksByUser, user, currUser.previousWalkLookback),
      ),
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
  let nextToken;
  const end = getDate(history);
  do {
    const walkList = yield API.graphql(
      graphqlOperation(ownerEndTime, {
        nextToken,
        owner: user,
        walkEnds: { gt: end },
        sortDirection: 'DESC',
      }),
    );
    nextToken = walkList.data.ownerEndTime.nextToken;
    walkList.data.ownerEndTime.items.forEach(walk => {
      mappedWalkList.push({
        ...walk,
        latitude: parseFloat(walk.latitude),
        longitude: parseFloat(walk.longitude),
      });
    });
  } while (nextToken);

  return mappedWalkList;
}

function* processSubscribeToNewWalks() {
  const subscriptionHelper = user => data => {
    try {
      const newWalk = data.value.data.onCreateWalk;
      if (newWalk) {
        if (user.following.includes(newWalk.owner)) {
          console.log('PUSHED NEW WALK', newWalk.owner);
          newWalks.push(newWalk);
        }
      }
    } catch (e) {
      console.error('failed subscriptionHelper', e);
    }
  };

  yield call(processUnsubscribeToNewWalks);
  const currUser = yield select(makeSelectCurrentUser());
  subscription = API.graphql(graphqlOperation(onCreateWalk)).subscribe({
    next: subscriptionHelper(currUser),
  });
}

function* processUnsubscribeToNewWalks() {
  if (subscription && subscription.unsubscribe) {
    console.log('UNSUBSCRIBE', subscription);
    subscription.unsubscribe();
    newWalks = [];
  }
}

function* pollNewWalks() {
  while (true) {
    yield delay(5000);
    if (newWalks.length > 0) {
      console.log('FOUND NEW WALK', subscriptionType);
      if (subscriptionType === 'followed') {
        yield put(fetchFollowedWalks);
      } else {
        yield put(fetchAllWalks);
      }
      newWalks = [];
    }
  }
}

function* mapSaga() {
  yield takeLatest(SET_WALK, processSaveWalk);
  yield takeLatest(FETCH_WALKS, processFetchWalks);
  yield takeLatest(DELETE_WALK, processDeleteWalk);

  yield takeLatest(FETCH_ALL_WALKS, processFetchAllWalks);
  yield takeLatest(FETCH_FOLLOWED_WALKS, processFollowedWalks);

  yield takeLatest(SUBSCRIBE_TO_WALKS, processSubscribeToNewWalks);
  yield takeLatest(UNSUBSCRIBE_TO_WALKS, processUnsubscribeToNewWalks);

  yield pollNewWalks();
}
export default mapSaga;

const getDate = history => {
  let allCheck = history === -1 ? -1800000 : -history;
  let timeAdd = parseInt(
    moment(new Date())
      .add(allCheck, 'm')
      .format('X'),
    10,
  );
  return timeAdd;
};
