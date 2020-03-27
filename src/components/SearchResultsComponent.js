import React from "react";
import {searchPage, searchQuery} from "../services/NcbiService";
import queryString from 'query-string';
import {PUBMED_ENTRY, MAX_RESULT} from "../common/contants";
import Highlighter from "react-highlight-words";
import {Route} from "react-router-dom";
import AdvancedSearchComponent from "./AdvancedSearchComponent";


class SearchResultsComponent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            fpage: 1,
            searchResults: [],
            searchResultsCount: 0,
            loading: false
        };
    }

    componentDidMount() {
        let res  = this.search();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.location.search !== this.props.location.search){
            let res = this.search(prevProps);
        }
    }

    /**
     * Process results and update state
     * @param results
     */
    processResponse = (results) => {
        let arr = [];

        if(results.hasOwnProperty("result")) {
            Object.keys(results.result).forEach(key => {
                if (key !== "uids") {
                    let el = {id: key};
                    Object.assign(el, results.result[key]);
                    arr.push(el);
                }
            });
        }
        // console.log("results: ",results);
        this.setState({
                          searchResults: arr,
                          searchResultsCount: parseInt(results.count),
                          loading: false,
                      });
    };

    /**
     * Continue to search if page not 1
     * @param prevProps
     * @returns {Promise<void>}
     */
    continueSearch = async (prevProps) => {
        const prevDict = queryString.parse(prevProps.location.search);
        const dict = queryString.parse(this.props.location.search);
        let query = "";
        Object.keys(dict).forEach(function(key){
            query += key+"="+dict[key]+"&";
        });

        if (prevDict["keywords"] === dict["keywords"] &&
            Object.keys(dict).includes("page")){
            this.setState({page: dict["page"]});
            const res = await searchPage(this.props.database, dict["page"]);
            this.processResponse(res);
        }else{
            if(Object.keys(dict).includes("page")){
                this.setState({page: dict["page"]});
            }else{
                dict["page"] = 1;
            }
            this.setState({
                              searchQuery: query,
                              searchTerm: dict["keywords"],
                              page: dict["page"],
                              fpage: dict["page"]
                          });
            const res = await searchQuery(this.props.database, query);
            this.processResponse(res);
        }
    };

    /**
     * Search keywords using web services
     * @param prevProps
     * @returns {Promise<void>}
     */
    search = async (prevProps) => {
        this.setState({
                          searchResults: [],
                            loading: true
                      });
        if(prevProps){
            this.continueSearch(prevProps)
        }else{
            const dict = queryString.parse(this.props.location.search);
            let query = "";
            Object.keys(dict).forEach(function(key){
                query += key+"="+dict[key]+"&";
            });
            const res = await searchQuery(this.props.database, query);
            this.setState({searchQuery: query,searchTerm: dict["keywords"],});
            this.processResponse(res);
        }
    };

    /**
     * Change page no.
     * @param e
     */
    changePageNo = (e) => {
        this.setState({
            page: e.target.value
                      })
    };

    /**
     * Submit page number
     * @param e
     * @returns {Promise<void>}
     */
    submitPageNo = async (e) => {
        e.preventDefault();
        if(!isNaN(this.state.page) &&
           parseInt(this.state.page) > 0 &&
           parseInt(this.state.page) <= Math.ceil(this.state.searchResultsCount/MAX_RESULT)) {
            this.setState({fpage: this.state.page});
            const dict = queryString.parse(this.props.location.search);
            let kw = dict["keywords"];
            this.props.history.push({
                                    pathname: `/search/db/${this.props.database}`,
                                    search: `?keywords=${kw}&page=${this.state.page}`
                                });
        }
    };

    /**
     * Change sort type
     * @param e
     */
    changeSortType = (e) => {
        const dict = queryString.parse(this.props.location.search);
        dict["sortBy"] = e.target.value;
        let query = "";
        Object.keys(dict).forEach(function(key){
            if(dict[key]!=null) {
                query += key + "=" + dict[key] + "&";
            }
        });
        this.props.history.push({
                        pathname: `/search/db/${this.props.database}`,
                        search: `?${query}`
                    });
    };

    render(){
        return (
            <div className="row">

                <div className="col-2 ncbi-advanced-search-panel">
                    <Route path="/search/db/:db?"
                           render={(props) =>
                               <AdvancedSearchComponent
                                   database = {this.props.database}
                                   searchTerm = {this.state.searchTerm}
                                   {...props}
                               />
                           }
                    />
                </div>

                <div className="col ncbi-search-result-panel">
                    <ul className="ncbi-search-meta">
                        <li className="ncbi-search-meta-item">
                            <span className="ncbi-search-count">
                                {this.state.searchResultsCount}&nbsp;
                                search results for '{this.state.searchTerm}'
                            </span>
                        </li>
                        <li className="ncbi-search-meta-item ncbi-item-count" style={{float: "right"}}>
                            &nbsp;&nbsp;Items&nbsp;
                                {(this.state.searchResultsCount === 0) ||
                                 (!this.state.fpage) ? 0 : (this.state.fpage) * MAX_RESULT - MAX_RESULT + 1}
                                &nbsp;to&nbsp;
                                {(this.state.fpage*MAX_RESULT <= this.state.searchResultsCount ? this.state.fpage*MAX_RESULT : this.state.searchResultsCount)}
                        </li>
                        <label htmlFor="sort-by" style={{float: "right"}}>Sort by:&nbsp;&nbsp;
                            <select name="sort-by" className="form-input ncbi-select-option" onChange={(e) => this.changeSortType(e)}>
                                <option className="ncbi-nav-select-option" value="relevance">Relevance</option>
                                <option className="ncbi-nav-select-option" value="first+author">First Author</option>
                                <option className="ncbi-nav-select-option" value="pub+date">Publication Date</option>
                            </select>
                        </label>
                    </ul>
                    <hr/>
                    <div className="ncbi-search-result-page">
                        {
                            this.state.loading &&
                            <img src={require("../assets/loading.gif")} className="loading" alt="loading.."/>
                        }
                        {
                            this.state.searchResults.map(item => (
                                <div className="ncbi-search-item" id={item["uid"]}>
                                    <a href={`${PUBMED_ENTRY}/${item["uid"]}`}
                                       target="_blank"
                                       title={item["abstract"]}
                                    className="ncbi-search-item-title">
                                        {
                                            // Since some title are missing from the results
                                            (item["title"] === "" ? item["sorttitle"] : item["title"])
                                        }
                                    </a>
                                    <br/>
                                    <span className="ncbi-search-item-date">Publication Date: {item["pubdate"]} | </span>
                                    {
                                        item["lastauthor"] &&
                                        <span className="ncbi-search-item-author">Last Author: {item["lastauthor"]}</span>
                                    }

                                    <br/>
                                    <Highlighter
                                        highlightClassName="ncbi-word-highlight"
                                        searchWords={[this.state.searchTerm]}
                                        autoEscape={true}
                                        textToHighlight={item["abstract"].substr(0,500) + " ..."}
                                    />
                                     </div>
                            ))
                        }
                    </div>
                    <form onSubmit={this.submitPageNo} className="ncbi-pageno-form">
                        Page&nbsp;
                        <input type="text" onChange={this.changePageNo} className="ncbi-page-input" value={this.state.page}/>
                        &nbsp;of&nbsp;
                        {Math.ceil(this.state.searchResultsCount/MAX_RESULT)}
                    </form>
                </div>
            </div>
        )
    }
}

export default SearchResultsComponent;