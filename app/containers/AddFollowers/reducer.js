/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import { SAVE_USER } from './constants';

// The initial state of the App
export const initialState = {
    userInfo: {},
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SAVE_USER:
        draft.userInfo = action.data;
        break;
    }
  });

export default appReducer;
