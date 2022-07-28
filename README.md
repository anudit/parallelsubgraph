# Parallel Markets Subgraph

Build completed: QmUeNeyfXqzT2QEmXg75jDtiQk6HAk4m7vBy1gJZDTuKdL

Deployed to https://thegraph.com/explorer/subgraph/anudit/parallel-identity

Subgraph endpoints:
Queries (HTTP):     https://api.thegraph.com/subgraphs/name/anudit/parallel-identity

## Examples

### Get IDs
```
{
  parallelIDs(where: {owner: "0x3faad8f2776dd17fa20d4d9707e7ab76b808adde" }) {
    owner
    tokenId
    traits
    subjectType
    isSanctionSafe
    metadata{
      description
      name
      attributes
      background_color
      animation_url
    }
  }
}
```
