/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import { SET_WALK_LIST, SET_OTHERS_WALK_LIST } from './constants';

// The initial state of the App
export const initialState = {
  walkList: [],
  otherWalkList: [],
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_WALK_LIST:
        console.log('REDUCER SET WALK LIST', action.data);
        draft.walkList = action.data;
        break;
      case SET_OTHERS_WALK_LIST:
        console.log('REDUCER SET OTHERS WALK LIST', action.data.map(w => w.owner));
        draft.otherWalkList = action.data;
    }
  });

export default appReducer;
