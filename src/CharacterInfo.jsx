import React from 'react';
import key from './apiInfo';

class CharacterInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            urlInfo: this.props.location.pathname.split("/"),
            charID: "",
            charInfo: [],
            charJobs: [],
            infoStatus: [],
            jobInfo: [],
            raceInfo: [],
            deityInfo: [],
            resultMessage: ""
        };
    }

    componentWillMount() {
        this.setState({
            charID: this.state.urlInfo[2]
        });

        // Gather reference information
        // Fetch classes/jobs
        fetch(`https://xivapi.com/classjob?key=${key}`)
        .then(response=> this.handleHTTPErrors(response))
        .then(response=> response.json())
        .then(result=> {
            this.setState({
                jobInfo: result.Results
            });
        })
        .catch(error=> {
            console.log(error);
        });
        
        // Fetch character races
        fetch(`https://xivapi.com/race?key=${key}`)
        .then(response=> this.handleHTTPErrors(response))
        .then(response=> response.json())
        .then(result=> {
            this.setState({
                raceInfo: result.Results
            });
        })
        .catch(error=> {
            console.log(error);
        });

        // Fetch guardian deities
        fetch(`https://xivapi.com/guardiandeity?key=${key}`)
        .then(response=> this.handleHTTPErrors(response))
        .then(response=> response.json())
        .then(result=> {
            this.setState({
                deityInfo: result.Results
            });
        })
        .catch(error=> {
            console.log(error);
        });
    }

    componentDidMount() {
        let time = (new Date()).getTime();
        // Fetch character information
        fetch(`https://xivapi.com/character/${this.state.charID}?key=${key}&nocache=${time}`)
        .then(response=> this.handleHTTPErrors(response))
        .then(response=> response.json())
        .then(result=> {
            this.setState({
                charInfo: result.Character,
                // No longer relveant with new API version
                // infoStatus: result.Character
            }, this.changeMessage);

            console.log(result);
            
            this.setState({
                charJobs: Object.values(this.state.charInfo.ClassJobs)
            }, this.sortJobs);
            
        })
        .catch(error=> {
            console.log(error);
        });       
    }

    changeMessage() {
        console.log("car");
        let newMessage = "Car";
            /* No longer relevant with new API version
            if (this.state.infoStatus.State === 1) {
                newMessage = "It looks like we haven't seen character #" + this.state.charID + " in a while. Please try again in a few minutes after we gather their info.";
            } else if (this.state.infoStatus.State !== 2) {
                newMessage = "There was an error finding character #" + this.state.charID + ".";
            }
            */
        this.setState({
            resultMessage: newMessage
        });  
    }

    handleHTTPErrors(response) {
        if (!response.ok) throw Error(response.status + ': ' + response.statusText);
        return response;
    }

    sortJobs() {
        let sortedJobs = this.state.charJobs.sort((a, b) => {
            if (a.JobID < b.JobID) {
                return -1;
            }
            if (a.JobID > b.JobID) {
                return 1;
            }
            return 0;
        });

        this.setState({
            charJobs: sortedJobs,
        });
    }
    
    render() {
        if (this.state.charInfo.length !== 0) {
            return (
                <div style={{ padding: 10 }}>
                    <img src={this.state.charInfo.Portrait} width="500" style={{ float: "left", border: "solid 2px" }} alt="" />
                    <div style={{ position: "relative", left: 16 }}>
                        <div>
                            <span style={{ fontSize: 48, fontWeight: "bold" }}>{this.state.charInfo.Name}</span>
                            <br/>
                            <span style={{ fontSize: 24 }}>{this.state.charInfo.Server}</span>
                            <span style={{ color: "#999999", paddingLeft: 100 }}>ID: {this.state.charID}</span>
                            <br/><br/>
                            <img src={require(`./images/gender/${this.state.charInfo.Gender}.png`)} width="18" style={{ paddingRight: 4 }} alt=""/>
                            <span>{this.state.raceInfo[this.state.charInfo.Race - 1].Name}</span>
                            <img src={`https://xivapi.com${this.state.deityInfo[this.state.charInfo.GuardianDeity - 1].Icon}?key=${key}`} width="18" style={{ paddingRight: 6, paddingLeft: 60 }} alt="" />
                            <span>{this.state.deityInfo[this.state.charInfo.GuardianDeity - 1].Name}</span>
                            <br/><br/>
                            <span>Nameday: {this.state.charInfo.Nameday}</span>
                        </div>
                        <div style={{ paddingTop: 16 }}>
                            <ul style={{ listStyle: "none" }}>
                                {this.state.charJobs.map(job =>
                                    <li id={job.JobID} style={{ display: "inline-block", padding: 10 }}>
                                        <img src={require(`.${this.state.jobInfo[job.JobID - 1].Icon}`)} width="40" alt=""/>
                                        <span style={{ position: "relative", right: 28, top: 12 }}>{job.Level}</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div style={{ padding: 10 }}>
                    <span>{this.state.resultMessage}</span>
                </div>
            )
        }
    }
}

export default CharacterInfo;