import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectCreateState = state => state.create || initialState;

export const makeSelectModalOpen = () =>
  createSelector(
    selectCreateState,
    walkState => walkState.createWalkOpen,
  );
