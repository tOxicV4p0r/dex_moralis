import { useState, useEffect } from "react"
import { Input, Popover, Radio, Modal, message } from "antd"
import { SettingOutlined, DownOutlined, ArrowDownOutlined } from "@ant-design/icons"
import tokenList from "./../tokenList.json"

function Swap() {
    const [slippage, setSlippage] = useState(2.5);
    const [tokenOneAmount, setTokenOneAmount] = useState(null);
    const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
    const [tokenOne, setTokenOne] = useState(tokenList[0]);
    const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);

    const handleSlippageChange = (e) => {
        setSlippage(e.target.value);
    }

    const changeAmount = (e) => {
        setTokenOneAmount(e.target.value);
        setTokenTwoAmount(e.target.value);
    }

    const switchToken = () => {
        setTokenOne(tokenTwo);
        setTokenTwo(tokenOne);
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

    const openModal = (token) => {
        setSelectedAsset(token);
        setIsOpen(true);
    }

    const changeToken = (token) => {
        if (selectedAsset == 1) {
            if (token == tokenTwo)
                setTokenTwo(tokenOne);
            setTokenOne(token);
        } else {
            if (token == tokenOne)
                setTokenOne(tokenTwo);
            setTokenTwo(token);
        }
        setIsOpen(false);
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
                    <div className="asset assetOne" onClick={() => openModal(1)}>
                        <img src={tokenOne.img} className="assetLogo" />
                        {tokenOne.ticker}
                        <DownOutlined />
                    </div>
                    <div className="asset assetTwo" onClick={() => openModal(2)}>
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