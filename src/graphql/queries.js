/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getWalk = /* GraphQL */ `
  query GetWalk($id: ID!) {
    getWalk(id: $id) {
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
export const listWalks = /* GraphQL */ `
  query ListWalks(
    $filter: ModelWalkFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWalks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        walkEnds
        publicity
        name
        description
        latitude
        longitude
        owner
      }
      nextToken
    }
  }
`;
export const getUserInfo = /* GraphQL */ `
  query GetUserInfo($id: ID!) {
    getUserInfo(id: $id) {
      id
      publicity
      following
      owner
    }
  }
`;
export const listUserInfos = /* GraphQL */ `
  query ListUserInfos(
    $filter: ModelUserInfoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserInfos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        publicity
        following
        owner
      }
      nextToken
    }
  }
`;
