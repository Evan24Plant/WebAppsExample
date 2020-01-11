import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import CharacterSearch from './CharacterSearch';
import CharacterInfo from './CharacterInfo';

const AppRouter = () => {
    return (
        <Router>
            <div style={{ minWidth: 960 }}>
                <div id="heading" style={{ borderBottom: "solid 2px" }}>
                    <nav >
                        <Link to="/" style={{ textDecoration: "none" }}>
                            <span style={{ fontSize: 64, color: "white", textShadow: "2px 2px #000000", position: "relative", top: 202, left: 28}}>FFXIV Character Search</span>
                        </Link>
                    </nav>
                    <a href="https://xivapi.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                        <div style={{ float: "right", position: "relative", bottom: 84 }}>
                            <span style={{ color: "white", textShadow: "2px 2px #000000", position: "relative", bottom: 24 }}>Powered by XIVAPI</span>
                            <img src={require("./images/xivapi.png")} alt="" style={{ padding: 5, width: 48 }}/>
                        </div>
                    </a>
                </div>
                <div>
                    <Route path="/" exact component={CharacterSearch} />
                    <Route path="/character/" component={CharacterInfo} />
                </div>
            </div>
        </Router>
    );
};

export default AppRouter;