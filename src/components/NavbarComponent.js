import React from 'react'
import {Link} from "react-router-dom";

class NavbarComponent extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            searchTerm: "",
        }
    }

    /**
     * Handle search form input
     * @param e
     * @returns {Promise<void>}
     */
    search = async (e) => {
        e.preventDefault();
        if(this.props.database !== "no-db") {
            this.props.history.push({
                pathname: `/search/db/${this.props.database}`,
                search: `?keywords=${this.state.searchTerm}&sortBy=relevance`
            });
            this.props.updateForm(this.state.searchTerm);
        }else{
            alert("Please select database")
        }
    };

    /**
     * Event handler for search input field
     * @param e
     */
    updateForm = (e) => {
        this.setState({
                          searchTerm: e.target.value
                      })
    };


    render(){
        return (
            <div className="ncbi-navbar">
                <Link to="/">
                    <div className="ncbi-nav-element">
                        <img src={require("../assets/ncbi-logo.png")} height="60px" width="auto" alt="NCBI"/>
                    </div>
                </Link>
                <div className="ncbi-nav-elements-container">
                    <div className="ncbi-nav-element">
                        <select className="form-control ncbi-nav-select"
                                onChange={(e) =>
                                    this.props.changeDb(e)}>
                            <option className="ncbi-nav-select-option" value="no-db">Select a database</option>
                            <option className="ncbi-nav-select-option"
                                    value="PubMed_DB"
                                    selected={this.props.database === "PubMed_DB"}>
                                PubMed</option>
                        </select>
                    </div>
                    <form onSubmit={(e) => this.search(e) }>
                        <div className="ncbi-nav-element ncbi-nav-search">
                            <input onChange={(e) =>
                                this.updateForm(e)} value={this.state.searchTerm}
                                   className="ncbi-field ncbi-new-query" type="text" placeholder="Search for keywords"/>
                        </div>
                        <div className="ncbi-nav-element ncbi-add">
                            <button type="submit" className="ncbi-button ncbi-search-btn">
                                <i className="fas fa-search"/>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default NavbarComponent