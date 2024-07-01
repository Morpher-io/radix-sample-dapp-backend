import express, { Request, Response } from "express";
import cors from "cors";

import { getSignatureOracleRequest, getDappPublicKey } from "./utils/oracle_requester";
import { PriceMessage } from "./utils/types";


const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cors());

const port = 8080;


app.get("/", (req: Request, res: Response) => {
    res.json({status: "OK"}) //Load Balancer Health Check.
})

/**
 * Functions for the Stable Coin Dapp
 */
app.get("/example/getPublicKey", async (req: Request, res: Response<{ publicKey: string }>) => {
    //add some checks if the user really sends the transaction
    //potentially counterfactual transaction so that a user is not bleeding out 
    //the API. This is up to the DAPP developer.
    res.json({ publicKey: getDappPublicKey() })
})
app.get("/example/getPrice", async (req: Request, res: Response<PriceMessage>, next) => {
    try {
        //add some checks if the user really sends the transaction
        //potentially counterfactual transaction so that a user is not bleeding out 
        //the API. This is up to the DAPP developer.
        const nftId = process.env.ORACLE_NFT_ID
        const currentNonceResponse = await fetch(process.env.ORACLE_BACKEND_URL+"/nonce/" + nftId)

        const nonceJson = await currentNonceResponse.json(); // {nonce: "123"};

        const marketId = "GATEIO:XRD_USDT";

        const signedPriceRequest = await getSignatureOracleRequest(marketId, nonceJson.nonce);

        console.log(signedPriceRequest)
        const signedPriceResponse = await fetch(`${process.env.ORACLE_BACKEND_URL}/price/${marketId}/${signedPriceRequest.nonce}/${signedPriceRequest.publicKeyBLS}/${signedPriceRequest.nftId}/${signedPriceRequest.signature}`);
        const signedPrice: PriceMessage = await signedPriceResponse.json();
        console.log(signedPrice);


        res.json(signedPrice);
    } catch (e) { next(e) }
})
app.get("/example/getTmpPrice", async (req: Request, res: Response<PriceMessage>) => {
    //add some checks if the user really sends the transaction
    //potentially counterfactual transaction so that a user is not bleeding out 
    //the API. This is up to the DAPP developer. 
    //Or get your own feed from Gateio/Binance as a temporary price indicator
})

function errorHandler(err, req, res, next) {
    res.status(500).json({ error: err.message, status: 500 })
}
app.use(errorHandler)

app.listen(port, async () => {
    console.log(`Listening on port ${port}...`);

});

