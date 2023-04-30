import { Link } from "react-router-dom";

function Header(props) {
    const { connect, isConnected, address } = props
    return (
        <header>
            <div className="leftH">
                <div>logo</div>
                <Link to="/" className="link">
                    <div>Swap</div>
                </Link>
                <Link to="/tokens" className="link">
                    <div>Tokens</div>
                </Link>
            </div>
            <div className="rightH">
                <div>Chain</div>
                {isConnected ?
                    <div>
                        {address.substr(0, 4) + "..." + address.substr(38)}
                    </div>
                    :
                    <div onClick={connect}>Connect</div>
                }

            </div>
        </header>
    )
}

export default Header;