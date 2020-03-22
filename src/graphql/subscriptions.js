/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateWalk = /* GraphQL */ `
  subscription OnCreateWalk {
    onCreateWalk {
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
export const onUpdateWalk = /* GraphQL */ `
  subscription OnUpdateWalk {
    onUpdateWalk {
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
export const onDeleteWalk = /* GraphQL */ `
  subscription OnDeleteWalk {
    onDeleteWalk {
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
export const onCreateUserInfo = /* GraphQL */ `
  subscription OnCreateUserInfo($owner: String!) {
    onCreateUserInfo(owner: $owner) {
      id
      publicity
      following
      previousWalkLookback
      owner
    }
  }
`;
export const onUpdateUserInfo = /* GraphQL */ `
  subscription OnUpdateUserInfo($owner: String!) {
    onUpdateUserInfo(owner: $owner) {
      id
      publicity
      following
      previousWalkLookback
      owner
    }
  }
`;
export const onDeleteUserInfo = /* GraphQL */ `
  subscription OnDeleteUserInfo($owner: String!) {
    onDeleteUserInfo(owner: $owner) {
      id
      publicity
      following
      previousWalkLookback
      owner
    }
  }
`;
