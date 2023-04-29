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
        setIsOpen(true);
    }

    return (
        <>
            <Modal
                open={isOpen}
                // onCancel={setIsOpen(false)}
                onCancel={() => setIsOpen(false)}
                footer={null}
                title="Select a"
            >

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
                    <div className="asset assetOne" onClick={() => openModal(tokenOne)}>
                        <img src={tokenOne.img} className="assetLogo" />
                        {tokenOne.ticker}
                        <DownOutlined />
                    </div>
                    <div className="asset assetTwo">
                        <img src={tokenTwo.img} className="assetLogo" />
                        {tokenTwo.ticker}
                        <DownOutlined />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Swap;