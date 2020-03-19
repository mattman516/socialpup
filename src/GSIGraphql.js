export const getWalkByOwner = /* GraphQL */ `
  query getWalkByOwner($owner: String!, $endTime: Int!) {
    ownerEndTime(owner: $owner, walkEnds: { gt: $endTime}) {
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