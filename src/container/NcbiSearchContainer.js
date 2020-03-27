import React from "react";
import "../css/home.css";
import NavbarComponent from "../components/NavbarComponent";
import SearchResultsComponent from "../components/SearchResultsComponent";
import {BrowserRouter, Route} from "react-router-dom";


class NcbiSearchContainer extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            database: 'PubMed_DB',
            searchTerm: '',
        };
    }

    /**
     * Change database
     * @param e event object
     */
    changeDb = (e) => {
        this.setState({
                          database: e.target.value
                      })
    };

    /**
     * handle search input field
     * @param newSearchTerm keywords to be searched
     */
    updateForm = (newSearchTerm) => {
        this.setState({
                          searchTerm: newSearchTerm
                      })
    };

    render(){
        return(
            <div>
                <BrowserRouter>
                    <Route path="/"
                           render={(props) =>
                               <NavbarComponent
                                   database={this.state.database}
                                   changeDb={this.changeDb}
                                   updateForm={this.updateForm}
                               {...props}/>
                           }
                    />
                   <div className="container-fluid">
                       <div className="ncbi-search-body">
                           <Route path="/search/db/:db?"
                                  render={(props) =>
                                      <SearchResultsComponent
                                          database={props.match.params.db}
                                          searchTerm={this.state.searchTerm}
                                          {...props}
                                      />
                                  }
                           />
                       </div>
                   </div>
                </BrowserRouter>
            </div>
        )
    }
}

export default NcbiSearchContainer;
