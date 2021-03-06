/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const SET_LOGIN = 'auth/SET_LOGIN';
export const SET_LOGOUT = 'auth/SET_LOGOUT';
export const CREATE_USER = 'auth/CREATE_USER';
export const SET_CURRENT_USER = 'auth/SET_CURRENT_USER';
