import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectWalkState = state => state.map || initialState;

export const makeSelectWalkList = () =>
  createSelector(
    selectWalkState,
    walkState => walkState.walkList,
  );
export const makeSelectOtherWalkList = () =>
  createSelector(
    selectWalkState,
    walkState => walkState.otherWalkList,
  );
export const makeSelectLatLng = () =>
  createSelector(
    selectWalkState,
    walkState => walkState.latLng,
  );
export const makeSelectListVisible = () =>
  createSelector(
    selectWalkState,
    walkState => walkState.listVisible,
  );
