import { useState, useEffect } from "react";
import { Input, Popover, Radio, Modal, message } from "antd";
import { SettingOutlined, DownOutlined, ArrowDownOutlined } from "@ant-design/icons";
import tokenList from "./../tokenList.json";
import axios from "axios";

function Swap() {
    const [slippage, setSlippage] = useState(2.5);
    const [tokenOneAmount, setTokenOneAmount] = useState(null);
    const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
    const [tokenOne, setTokenOne] = useState(tokenList[0]);
    const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(tokenOne);
    const [assetChanged, setAssetChanged] = useState(null);
    const [priceFeed, setPriceFeed] = useState(null);

    useEffect(() => {
        fetchPrice(tokenOne.address, tokenTwo.address);
    }, [tokenOne, tokenTwo])

    const fetchPrice = async (addressone, addresstwo) => {
        const res = await axios.get('http://localhost:3001/tokenprice', {
            params: { addressone, addresstwo }
        })

        console.log(res.data);
        setPriceFeed(res.data);
    }

    const handleSlippageChange = (e) => {
        setSlippage(e.target.value);
    }

    const changeAmount = (e) => {
        setTokenOneAmount(e.target.value);
        if (e.target.value && priceFeed) {
            const { one, two } = priceFeed;
            setTokenTwoAmount(((e.target.value * one) / two).toFixed(6));
        } else
            setTokenTwoAmount(null);
    }

    const switchToken = () => {
        setTokenOne(tokenTwo);
        setTokenTwo(tokenOne);
        setTokenOneAmount(tokenTwoAmount)
        setTokenTwoAmount(tokenOneAmount)
    }

    const settingContent = () => {
        return (
            <>
                <div>Slippage Tolerance</div>
                <div>
                    <Radio.Group value={slippage} onChange={handleSlippageChange} >
                        <Radio.Button value={0.5}>0.5%</Radio.Button>
                        <Radio.Button value={2.5}>2.5%</Radio.Button>
                        <Radio.Button value={5}>5%</Radio.Button>
                    </Radio.Group>
                </div>
            </>
        )
    }

    const openModal = (token, asset) => {
        setSelectedAsset(token);
        setAssetChanged(asset)
        setIsOpen(true);
    }

    const changeToken = (token) => {
        if (assetChanged == 1) {
            if (token == tokenTwo)
                setTokenTwo(tokenOne);
            setTokenOne(token);
        } else {
            if (token == tokenOne)
                setTokenOne(tokenTwo);
            setTokenTwo(token);
        }
        setIsOpen(false);
        setTokenOneAmount(null)
        setTokenTwoAmount(null)
    }

    return (
        <>
            <Modal
                open={isOpen}
                onCancel={() => setIsOpen(false)}
                footer={null}
                title="Select a token"
            >
                <div className="modalContent">
                    {tokenList?.map((e, i) => {
                        if (selectedAsset.ticker != e.ticker)
                            return (
                                <div key={i} className="tokenChoice" onClick={() => changeToken(e)}>
                                    <img src={e.img} className="tokenLogo" />
                                    <div>
                                        <div className="tokenName">{e.name}</div>
                                        <div className="tokenTicker" >{e.ticker}</div>
                                    </div>
                                </div>
                            );
                    })}

                </div>

            </Modal>
            <div className="tradeBox">
                <div className="tradeBoxHeader">
                    <h4>Swap</h4>
                    <Popover
                        content={settingContent}
                        title="Settings"
                        trigger="hover"
                        placement="bottomRight"
                    >
                        <SettingOutlined className="cog" />
                    </Popover>
                </div>
                <div className="inputs">
                    <Input placeholder="0" value={tokenOneAmount} onChange={changeAmount} />
                    <Input placeholder="0" value={tokenTwoAmount} disabled={true} />
                    <div className="switchButton" onClick={switchToken}>
                        <ArrowDownOutlined className="switchArrow" />
                    </div>
                    <div className="asset assetOne" onClick={() => openModal(tokenOne, 1)}>
                        <img src={tokenOne.img} className="assetLogo" />
                        {tokenOne.ticker}
                        <DownOutlined />
                    </div>
                    <div className="asset assetTwo" onClick={() => openModal(tokenTwo, 2)}>
                        <img src={tokenTwo.img} className="assetLogo" />
                        {tokenTwo.ticker}
                        <DownOutlined />
                    </div>
                </div>
                <div className="swapButton" disabled={tokenOneAmount <= 0}>Swap</div>
            </div>
        </>
    )
}

export default Swap;