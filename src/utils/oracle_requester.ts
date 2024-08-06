import { bytesToHex } from "@noble/curves/abstract/utils";
import { bls12_381 as bls } from '@noble/curves/bls12-381';
import { OracleRequestMessage } from "./types";

// Use custom DST, e.g. for Ethereum consensus layer
const htfEthereum = { DST: 'BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_POP_' };


export function getPublicKey(privateKey) {
  return Array.from(bls.getPublicKey(privateKey), byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function getSignatureOracleRequest(marketId: string, nonce: number): Promise<OracleRequestMessage> {

  const nftId = process.env.ORACLE_NFT_ID;
  const pk = process.env.PK_DAPP;

  let oracleRequestMsg: OracleRequestMessage = {
    marketId,
    // nonce: Number(nonce) + 1,
    publicKeyBLS: getPublicKey(pk),
    nftId,
    signature: ""
  };

  const new_msg = Buffer.from(oracleRequestMsgToString(oracleRequestMsg), 'utf8').toString('hex');
  // const isValidEth = bls.verify(signatureEth, new_msg, getPublicKey(), htfEthereum);
  
  let signature = bytesToHex(await bls.sign(new_msg, pk, htfEthereum));

  oracleRequestMsg.signature = signature;

  // console.log(oracleRequestMsg);
  // validateOracleRequest(oracleRequestMsg);
  return oracleRequestMsg;

}

export function getDappPublicKey() {
  const pk = process.env.PK_DAPP;
  return getPublicKey(pk);
}

export function oracleRequestMsgToString(msg: OracleRequestMessage) {
  return msg.marketId + "##" + msg.publicKeyBLS + "##" + msg.nftId;
}

// export async function generateSecureRandomBytes(
//   count: number
// ): Promise<Uint8Array> {
//   const byteArray = new Uint8Array(count);
//   global.crypto.getRandomValues(byteArray);
//   return byteArray;
// }

// // NOTE - the below function is for example purposes only
// // It is up to you to ensure that your generation of key pairs is safe for production use
// async function generateEd25519PrivateKey(): Promise<PrivateKey> {
//   // return new PrivateKey.Ed25519(await generateSecureRandomBytes(32));
//   return new PrivateKey.Ed25519(hexToBytes(pk));
// }