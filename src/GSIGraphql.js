export const getWalkByOwner = /* GraphQL */ `
  query getWalkByOwner($owner: String!) {
    ownerEndTime(owner: $owner) {
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