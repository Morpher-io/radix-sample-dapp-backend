
export type PriceMessage = {
    marketId: string;
    price: number;
    nonce: string;
    createdAt: number;
    signature?: string;
}

export type OracleRequestMessage = {
    marketId: string;
    nonce: number;
    publicKeyBLS: string;
    nftId: string;
    signature: string;
  }
  