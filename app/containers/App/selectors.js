/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectGlobal = state => state.global || initialState;

export const makeSelectAuthState = () =>
  createSelector(
    selectGlobal,
    globalState => ({
      loggedIn: globalState.loggedIn,
      authUserData: globalState.authUserData,
    }),
  );

export const makeSelectCurrentUser = () => 
  createSelector(
    selectGlobal,
    globalState => globalState.currentUser,
  );
