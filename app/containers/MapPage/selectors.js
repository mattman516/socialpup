import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectWalkState = state => state.map || initialState;

export const makeSelectWalkList = () =>
  createSelector(
    selectWalkState,
    walkState => walkState.walkList,
  );