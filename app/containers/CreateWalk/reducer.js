

import produce from 'immer';
import { TOGGLE_CREATE_WALK_MODAL } from './constants';

// The initial state of the App
export const initialState = {
  createWalkOpen: false,
  initWalk: {},
};

/* eslint-disable default-case, no-param-reassign */
const createReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case TOGGLE_CREATE_WALK_MODAL:
        draft.createWalkOpen = !state.createWalkOpen;
        draft.initWalk = action.data;
        break;
    }
  });

export default createReducer;
