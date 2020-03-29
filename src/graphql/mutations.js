/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createWalk = /* GraphQL */ `
  mutation CreateWalk(
    $input: CreateWalkInput!
    $condition: ModelWalkConditionInput
  ) {
    createWalk(input: $input, condition: $condition) {
      id
      walkEnds
      publicity
      name
      description
      latitude
      longitude
      owner
    }
  }
`;
export const updateWalk = /* GraphQL */ `
  mutation UpdateWalk(
    $input: UpdateWalkInput!
    $condition: ModelWalkConditionInput
  ) {
    updateWalk(input: $input, condition: $condition) {
      id
      walkEnds
      publicity
      name
      description
      latitude
      longitude
      owner
    }
  }
`;
export const deleteWalk = /* GraphQL */ `
  mutation DeleteWalk(
    $input: DeleteWalkInput!
    $condition: ModelWalkConditionInput
  ) {
    deleteWalk(input: $input, condition: $condition) {
      id
      walkEnds
      publicity
      name
      description
      latitude
      longitude
      owner
    }
  }
`;
export const createUserInfo = /* GraphQL */ `
  mutation CreateUserInfo(
    $input: CreateUserInfoInput!
    $condition: ModelUserInfoConditionInput
  ) {
    createUserInfo(input: $input, condition: $condition) {
      id
      publicity
      following
      previousWalkLookback
      owner
    }
  }
`;
export const updateUserInfo = /* GraphQL */ `
  mutation UpdateUserInfo(
    $input: UpdateUserInfoInput!
    $condition: ModelUserInfoConditionInput
  ) {
    updateUserInfo(input: $input, condition: $condition) {
      id
      publicity
      following
      previousWalkLookback
      owner
    }
  }
`;
export const deleteUserInfo = /* GraphQL */ `
  mutation DeleteUserInfo(
    $input: DeleteUserInfoInput!
    $condition: ModelUserInfoConditionInput
  ) {
    deleteUserInfo(input: $input, condition: $condition) {
      id
      publicity
      following
      previousWalkLookback
      owner
    }
  }
`;
