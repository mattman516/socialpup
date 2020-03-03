/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateWalk = /* GraphQL */ `
  subscription OnCreateWalk($owner: String!) {
    onCreateWalk(owner: $owner) {
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
  subscription OnUpdateWalk($owner: String!) {
    onUpdateWalk(owner: $owner) {
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
  subscription OnDeleteWalk($owner: String!) {
    onDeleteWalk(owner: $owner) {
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
      owner
    }
  }
`;
