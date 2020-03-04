/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import { SET_LOGIN, SET_LOGOUT, SET_CURRENT_USER } from './constants';

// The initial state of the App
export const initialState = {
  loading: false,
  error: false,
  currentUser: false,
  loggedIn: false,
  authUserData: {},
  currentUser: {},
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_LOGIN:
        draft.loggedIn = true;
        draft.authUserData = action.data;
        break;
      case SET_LOGOUT:
        draft.loggedIn = false;
        draft.authUserData = {};
        break;
      case SET_CURRENT_USER:
        draft.currentUser = action.data;
        break;
    }
  });

export default appReducer;
