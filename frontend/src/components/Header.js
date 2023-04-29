import { Link } from "react-router-dom";

function Header() {
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
                <div>Connect</div>
            </div>
        </header>
    )
}

export default Header;