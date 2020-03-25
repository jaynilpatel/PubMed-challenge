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


    changeDb = (e) => {
        this.setState({
                          database: e.target.value
                      })
    };

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
                       <div className="row ncbi-search-body">
                           <div className="col-2 ncbi-advanced-search-panel">
                               Advanced Search
                           </div>
                           <div className="col ncbi-search-result-panel">
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
                   </div>
                </BrowserRouter>
            </div>
        )
    }
}

export default NcbiSearchContainer;
