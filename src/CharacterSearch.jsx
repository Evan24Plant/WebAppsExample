import React from 'react';
import { withRouter } from 'react-router-dom';
import key from './apiInfo';
//import ResultPages from './ResultPages';

class CharacterSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            servers: [],
            searchPag: [],
            searchResult: [],
            serverSelect: "",
            charName: "",
            currentPage: "1",
            displayResults: false
        };
        this.handleForm = this.handleForm.bind(this);
        this.handleServer = this.handleServer.bind(this);
        this.handleCharName = this.handleCharName.bind(this);
        this.handleCharSelect = this.handleCharSelect.bind(this);
        this.handlePage = this.handlePage.bind(this);
    }

    componentDidMount() {
        fetch(`https://xivapi.com/servers?key=${key}`)
        .then(response=> this.handleHTTPErrors(response))
        .then(response=> response.json())
        .then(result=> {
            this.setState({
                servers: result
            });
        })
        .catch(error=> {
            console.log(error);
        });
    }

    // Handler for character name update
    handleCharName(event) {
        this.setState({
            charName: event.target.value
        });
    }

    // Handler for selected character from result set
    handleCharSelect(event) {
        this.props.history.push('/character/' + event.target.id);
    }

    // Handler for search
    handleForm() {
        let urlName = this.state.charName.replace(" ", "+");

        fetch(`https://xivapi.com/character/search?name=${urlName}&server=${this.state.serverSelect}&page=${this.state.currentPage}&key=${key}`)
        .then(response=> this.handleHTTPErrors(response))
        .then(response=> response.json())
        .then(result=> {
            this.setState({
                searchPag: result['Pagination'],
                searchResult: result['Results'],
                displayResults: true
            });
        })
        .catch(error=> {
            console.log(error);
        });
    }

    handleHTTPErrors(response) {
        if (!response.ok) throw Error(response.status + ': ' + response.statusText);
        return response;
    }
    
    handlePage(event) {
        event.preventDefault();

        this.setState({
            currentPage: event.target.id
        }, this.handleForm);
    }

    // Handler for server selection
    handleServer(event) {
        this.setState({
            serverSelect: event.target.value
        });
    }

    render () {
        const ResultPages = (props) => {
            let pageLinks = [];
            
            for (let i=1; i <= props.pageTotal; i++) {
                if (i === props.currentPage) {
                    pageLinks.push({"page": i, "checked": true});
                } else {
                    pageLinks.push({"page": i, "checked": false});
                }
            }

            return (
                <div>
                    <form>
                        {pageLinks.map(page =>
                            <label class="container" id={page.page} onClick={this.handlePage}>&nbsp;
                                <input type="radio" id={page.page} checked={page.checked} name="radio" />
                                <span class="checkmark"id={page.page} >{page.page}</span>
                            </label>
                        )}
                    </form>
                </div>
            )
        }
        
        const SearchResults = (props) => {
            return (
                <div style={{ width: "100%" }}>
                    {props.result.map(char =>
                        <div id={char.ID} class="result" onClick={this.handleCharSelect} style={{ width: "100%", height: 100,  borderBottom: "solid 2px", borderColor: "#d9d9d9", padding: 3, paddingTop: 7, cursor: "pointer" }}>
                            <img id={char.ID} src={char.Avatar} alt="" style={{ float: "left" }}/>
                            <div id={char.ID} style={{ position: "relative", left: 16, top: 12 }}>
                                <span id={char.ID} style={{ fontSize: 32, fontWeight: "bold" }}>{char.Name}</span>
                                <br/>
                                <span id={char.ID} style={{ fontSize: 16, fontWeight: "bold" }}>{char.Server}</span>
                            </div>
                        </div>
                    )}
                </div>
            )
        }

        if (this.state.displayResults){
            return (
                <div>
                    <form onSubmit={this.handlePage} >
                        <fieldset style={{ border: "none", backgroundColor: "#cddfe4" }}>
                            <div>
                                <label style={{ paddingRight: 30 }}>
                                    Server&nbsp;
                                    <select onChange={this.handleServer}>
                                        <option value=""></option>
                                        {this.state.servers.map(server =>
                                            <option value={server}>{server}</option>
                                        )}
                                    </select>
                                </label>
                                <label style={{ paddingRight: 30 }}>
                                    Character Name&nbsp;<input type="text" name="profileName" style={{ width: 320 }} maxLength="31" onChange={this.handleCharName}></input>
                                </label>
                                <label style={{ float: "Right" }}>
                                    <input type="submit" value="Search" />
                                </label>
                            </div>
                        </fieldset>
                    </form>
                    <div style={{ padding: 3, borderBottom: "solid 2px", borderColor: "#d9d9d9" }}>
                        <span>Results: {this.state.searchPag.ResultsTotal}</span>
                        <div style={{ float: "right" }}>
                            <ResultPages pageTotal={this.state.searchPag.PageTotal} currentPage={this.state.searchPag.Page} />
                        </div>
                    </div>
                    <SearchResults result={this.state.searchResult} />
                </div>
            );
        } else {
            return (
                <form onSubmit={this.handlePage}>
                    <fieldset style={{ border: "none", backgroundColor: "#cddfe4" }}>
                        <div>
                            <label style={{ paddingRight: 30 }}>
                                Server&nbsp;
                                <select onChange={this.handleServer}>
                                    <option value=""></option>
                                    {this.state.servers.map(server =>
                                        <option value={server}>{server}</option>
                                    )}
                                </select>
                            </label>
                            <label style={{ paddingRight: 30 }}>
                                Character Name&nbsp;<input type="text" name="profileName" style={{ width: 320 }} maxLength="31" onChange={this.handleCharName}></input>
                            </label>
                            <input type="hidden" name="page" />
                            <label style={{ float: "Right" }}>
                                <input type="submit" value="Search" />
                            </label>
                        </div>
                    </fieldset>
                </form>
            );
        }
    }
}

export default withRouter(CharacterSearch);