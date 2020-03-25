import React from 'react'
import {Link} from "react-router-dom";

class NavbarComponent extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            searchTerm: "",
        }
    }

    search = async (e) => {
        e.preventDefault();
        if(this.props.database !== "") {
            this.props.history.push({
                pathname: `/search/db/${this.props.database}`,
                search: `?keywords=${this.state.searchTerm}`
            });
            this.props.updateForm(this.state.searchTerm);
        }else{
            alert("Please select database")
        }
    };

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
                        <span className="ncbi-brand-title">NCBI&nbsp;</span>
                    </div>
                </Link>
                <div className="ncbi-nav-element">
                    <select className="ncbi-nav-select" onChange={(e) => this.props.changeDb(e)}>
                        <option className="ncbi-nav-select-option">Select a database</option>
                        <option className="ncbi-nav-select-option" value="PubMed_DB">PubMed</option>
                    </select>
                </div>
                <form onSubmit={(e) => this.search(e) }>
                    <div className="ncbi-nav-element ncbi-nav-search">
                        <input onChange={(e) => this.updateForm(e)} value={this.state.searchTerm} className="ncbi-field ncbi-new-query" type="text" placeholder="Search keywords"/>
                    </div>
                    <div className="ncbi-nav-element ncbi-add">
                        <button type="submit" className="ncbi-button ncbi-add-course">
                            <i className="fas fa-search"/>
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

export default NavbarComponent