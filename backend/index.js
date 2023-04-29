const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/tokenprice", async (req, res) => {
    const { query } = req;
    console.log(query);
    const { addressone = "", addresstwo = "" } = query;

    const resOne = await Moralis.EvmApi.token.getTokenPrice({
        address: addressone
    });

    const resTwo = await Moralis.EvmApi.token.getTokenPrice({
        address: addresstwo
    });

    console.log(resOne.raw.usdPrice)
    console.log(resTwo.raw.usdPrice)
    res.json({ one: resOne.raw.usdPrice, two: resTwo.raw.usdPrice });
});

Moralis.start({
    apiKey: process.env.MORALIS_KEY
}).then(() => {
    app.listen(port, () => {
        console.log(process.env.MORALIS_KEY)
        console.log(`start server on port : ${port}`);
    })
})
