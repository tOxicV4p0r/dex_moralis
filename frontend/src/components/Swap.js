import { useState, useEffect } from "react";
import { Input, Popover, Radio, Modal, message } from "antd";
import { SettingOutlined, DownOutlined, ArrowDownOutlined } from "@ant-design/icons";
import tokenList from "./../tokenList.json";
import token1Inch from "./../tokenInfo1Inch.json";
import axios from "axios";
import { useSendTransaction, useWaitForTransaction } from "wagmi";

function Swap(props) {
    const { isConnected, address } = props;

    const [slippage, setSlippage] = useState(2.5);
    const [messageApi, contextHolder] = message.useMessage();
    const [tokenOneAmount, setTokenOneAmount] = useState(null);
    const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
    const [tokenOne, setTokenOne] = useState({ symbol: '', logoURI: '', name: '' });
    const [tokenTwo, setTokenTwo] = useState({ symbol: '', logoURI: '', name: '' });
    const [isOpen, setIsOpen] = useState(false);
    const [tokenList1Inch, setTokenList1Inch] = useState(null);
    const [selectedAsset, setSelectedAsset] = useState(tokenOne);
    const [assetChanged, setAssetChanged] = useState(null);
    const [priceFeed, setPriceFeed] = useState(null);
    const [txDetails, setTxDetails] = useState({
        to: null,
        data: null,
        value: null
    });

    const { data, sendTransaction } = useSendTransaction({
        request: {
            from: address,
            to: String(txDetails.to),
            data: String(txDetails.data),
            value: String(txDetails.value)
        }
    });

    const { isLoading, isSuccess } = useWaitForTransaction({ hash: data?.hash });

    useEffect(() => {
        messageApi.destroy();
        if (isLoading) {
            messageApi.open({
                type: 'loading',
                content: 'Transaction is Pending...',
                duration: 0
            });
        }

    }, [isLoading]);

    useEffect(() => {
        messageApi.destroy();
        if (isSuccess) {
            messageApi.open({
                type: 'success',
                content: 'Transaction Successful',
                duration: 1.5
            });
        } else if (txDetails.to) {
            messageApi.open({
                type: 'error',
                content: 'Transaction Failed',
                duration: 1.5
            });
        }

    }, [isSuccess]);

    useEffect(() => {
        const arr = Object.entries(token1Inch).map(e => e[1]);
        setTokenList1Inch(arr);
        setTokenOne(arr[0]);
        setTokenTwo(arr[1]);
    }, []);

    useEffect(() => {
        console.log()
        if (txDetails.to && isConnected) {
            sendTransaction();
        }
    }, [txDetails]);

    useEffect(() => {
        fetchPrice(tokenOne, tokenTwo);
    }, [tokenOne, tokenTwo])

    const fetchDexSwap = async () => {
        /*
        console.log(tokenOneAmount, tokenOne.decimals)
        const am1 = tokenOneAmount.padEnd(tokenOne.decimals + tokenOneAmount.length, '0');
        console.log(am1)
        console.log(tokenOneAmount * (10 ** tokenOne.decimals))
        return;
        */
        // check allowance
        // https://api.1inch.io/v5.0/1/approve/allowance?tokenAddress=...&walletAddress=...
        // approve
        // https://api.1inch.io/v5.0/1/approve/transaction?tokenAddress=...&amount=100000000000
        const res = await axios.get('https://api.1inch.io/v5.0/10/approve/allowance', {
            params: { tokenAddress: tokenOne.address, walletAddress: address }
        });
        console.log(res.data)
        const { allowance = 0 } = res.data
        if (allowance * 1 <= 0) {
            const approvedData = await axios.get('https://api.1inch.io/v5.0/10/approve/transaction', {
                params: { tokenAddress: tokenOne.address }
            })
            console.log(approvedData.data)
            setTxDetails(approvedData.data)
            return;
        }


        const amount = tokenOneAmount * (10 ** tokenOne.decimals);
        const tx = await axios.get('https://api.1inch.io/v5.0/10/swap', {
            params: {
                fromTokenAddress: tokenOne.address,
                toTokenAddress: tokenTwo.address,
                amount,
                fromAddress: address,
                slippage
            }
        });

        setTxDetails(tx.data.tx);
    }

    const fetchPrice = async (one, two) => {
        if (one.symbol == '' || two.symbol == '')
            return;

        //const res = await axios.get('http://localhost:3001/tokenprice', {
        //    params: { addressone, addresstwo }
        //})

        const res = await axios.get('https://api.1inch.io/v5.0/10/quote', {
            params: {
                fromTokenAddress: one.address,
                toTokenAddress: two.address,
                amount: 1 * (10 ** one.decimals)
            }
        });

        const { toTokenAmount = 0, toToken = { decimals: 0 } } = res.data;
        setPriceFeed(toTokenAmount / (10 ** toToken.decimals));
    }

    const handleSlippageChange = (e) => {
        setSlippage(e.target.value);
    }

    const changeAmount = (e) => {
        setTokenOneAmount(e.target.value);
        if (e.target.value && priceFeed) {
            setTokenTwoAmount(e.target.value * priceFeed);
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
            {contextHolder}
            <Modal
                open={isOpen}
                onCancel={() => setIsOpen(false)}
                footer={null}
                title="Select a token"
            >
                <div className="modalContent">
                    {tokenList1Inch?.map((e, i) => {
                        if (selectedAsset.symbol != e.symbol)
                            return (
                                <div key={i} className="tokenChoice" onClick={() => changeToken(e)}>
                                    <img src={e.logoURI} className="tokenLogo" />
                                    <div>
                                        <div className="tokenName">{e.name}</div>
                                        <div className="tokenTicker" >{e.symbol}</div>
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
                        <img src={tokenOne.logoURI} className="assetLogo" />
                        {tokenOne.symbol}
                        <DownOutlined />
                    </div>
                    <div className="asset assetTwo" onClick={() => openModal(tokenTwo, 2)}>
                        <img src={tokenTwo.logoURI} className="assetLogo" />
                        {tokenTwo.symbol}
                        <DownOutlined />
                    </div>
                </div>
                <div className="swapButton" disabled={tokenOneAmount <= 0 || !isConnected} onClick={fetchDexSwap}>Swap</div>
            </div>
        </>
    )
}

export default Swap;