import {
  Contract,
  RecipientMintCall,
  Transfer,
} from "../generated/Contract/Contract"
import { Metadata, ParallelID } from "../generated/schema"
import { ipfs, JSONValue,  json, JSONValueKind, BigInt } from "@graphprotocol/graph-ts"

export function handleTransfer(event: Transfer): void {
  let entity = ParallelID.load(event.params.tokenId.toString());
  if (entity === null) {
    entity = new ParallelID(event.params.tokenId.toString());
  }
  entity.tokenId = event.params.tokenId;
  entity.owner = event.params.to.toHexString();
  entity.mintedOn = event.block.timestamp;
  entity.txnHash = event.transaction.hash;

  const contract = Contract.bind(event.address);

  entity.traits = contract.traits(event.params.tokenId);
  entity.subjectType = BigInt.fromI32(contract.subjectType(event.params.tokenId));

  let tokenURI = contract.tokenURI(event.params.tokenId);
  entity.tokenURI = tokenURI;
  entity.isSanctionSafe = contract.isSanctionsSafe(event.params.tokenId);

  let hash = tokenURI.replace('ipfs://', '');
  let data = ipfs.cat(hash);

  if (data) {

    let jsonData = json.fromBytes(data).toObject();
    if (jsonData) {

      const metaDataEntity = new Metadata(event.params.tokenId.toString());
      metaDataEntity.idPointed = event.params.tokenId.toString();

      const name = jsonData.get("name");
      if (name) metaDataEntity.name = name.toString();

      const description = jsonData.get("description");
      if (description) metaDataEntity.description = description.toString();

      const image = jsonData.get("image");
      if (image) metaDataEntity.image = image.toString();

      const animation_url = jsonData.get("animation_url");
      if (animation_url) metaDataEntity.animation_url = animation_url.toString();

      const external_url = jsonData.get("external_url");
      if (external_url) metaDataEntity.external_url = external_url.toString();

      const background_color = jsonData.get("background_color");
      if (background_color) metaDataEntity.background_color = background_color.toString();


      let attributes = jsonData.get("attributes");
      if (attributes) {
        let attrs = attributes.toArray();
        let attrsParsed: string[] = [];

        for (let index = 0; index < attrs.length; index++) {
          let item = attrs[index].toObject();

          let tt = item.get('trait_type');
          let t = item.get('value');
          if (t && tt) {
            attrsParsed.push(tt.toString().concat('-').concat(t.toString()));
          }
        }

        metaDataEntity.attributes = attrsParsed;
      }

      metaDataEntity.save();
    }

  };

  entity.save();
}
