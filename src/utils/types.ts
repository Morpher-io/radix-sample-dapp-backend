export type PricePoint = {
    marketId: string;
    price: number;
    nonce: string;
    dataTimestamp: number;
    oracleTimestamp: number;
    marketStatusTimestamp: number;
    marketStatus: string;
}

export type PriceMessage = {
    data: PricePoint[];
    signature?: string;
}

export type OracleRequestMessage = {
    marketId: string;
    // nonce: number;
    publicKeyBLS: string;
    nftId: string;
    signature: string;
}
