import React from "react";
import {searchPage, searchQuery} from "../services/NcbiService";
import queryString from 'query-string';
import {PUBMED_ENTRY, MAX_RESULT} from "../common/contants";

class SearchResultsComponent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            fpage: 1,
            searchResults: [],
            searchResultsCount: 0,
        };
    }

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
        console.log("results: ",results);
        this.setState({
                          searchResults: arr,
                          searchResultsCount: parseInt(results.count),
                      });
    };


    search = async (prevProps) => {
        const prevDict = queryString.parse(prevProps.location.search);
        const dict = queryString.parse(this.props.location.search);
        if (prevDict["keywords"] === dict["keywords"] &&
            Object.keys(dict).includes("page")){
            this.setState({page: dict["page"]});
            const res = await searchPage(this.props.database, dict["page"]);
            this.processResponse(res);
        }else{
            let qTerm = "";
            Object.keys(dict).forEach(function(key){
                qTerm += key+"="+dict[key]+"&";
            });
            console.log("qterm: ", qTerm);
            if(Object.keys(dict).includes("page")){
                this.setState({page: dict["page"]});
            }else{
                dict["page"] = 1;
            }
            this.setState({
                              searchTerm: qTerm,
                              page: dict["page"],
                              fpage: dict["page"]
                          });
            const res = await searchQuery(this.props.database, qTerm);
            this.processResponse(res);
        }
    };

    componentDidMount() {
        this.search();
        console.log("DID MOUNT")
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.location.search !== this.props.location.search){
            this.search(prevProps);
            console.log("did update");
        }
    }

    changePageNo = (e) => {
        this.setState({
            page: e.target.value
                      })
    };

    submitPageNo = async (e) => {
        e.preventDefault();
        if(!isNaN(this.state.page) &&
           parseInt(this.state.page) > 0 &&
           parseInt(this.state.page) <= Math.ceil(this.state.searchResultsCount/MAX_RESULT)) {
            // const res = await searchPage(this.props.database, this.state.page);
            this.setState({fpage: this.state.page});
            // this.processResponse(res);
            const dict = queryString.parse(this.props.location.search);
            let kw = dict["keywords"];
            this.props.history.push({
                                    pathname: `/search/db/${this.props.database}`,
                                    search: `?keywords=${kw}&page=${this.state.page}`
                                });
        }
    };

    render(){
        return (
            <div>
                <ul className="ncbi-search-meta">
                    <li className="ncbi-search-meta-item">
                        Search Results: Item&nbsp;
                        {(this.state.searchResultsCount === 0) ||
                         (!this.state.fpage) ? 0 : (this.state.fpage) * MAX_RESULT - MAX_RESULT + 1}
                        &nbsp;to&nbsp;
                        {(this.state.fpage*MAX_RESULT <= this.state.searchResultsCount ? this.state.fpage*MAX_RESULT : this.state.searchResultsCount)}
                        &nbsp;of&nbsp;
                        {this.state.searchResultsCount}
                    </li>
                    <li className="ncbi-search-meta-item" style={{float: "right"}}>
                        <form onSubmit={this.submitPageNo}>
                            Page&nbsp;
                            <input type="text" onChange={this.changePageNo} className="ncbi-page-input" value={this.state.page}/>
                            &nbsp;of&nbsp;
                            {Math.ceil(this.state.searchResultsCount/MAX_RESULT)}
                        </form>
                    </li>
                </ul>
                <hr/>
                <div className="ncbi-search-result-page">
                    {
                        this.state.searchResults.map(item => (
                            <div className="ncbi-search-item" id={item["uid"]}>
                                <a href={`${PUBMED_ENTRY}/${item["uid"]}`}
                                   target="_blank"
                                   title="here there needs to be an abstract"
                                className="ncbi-search-item-title">
                                    {
                                        // Since some title are missing from the results
                                        (item["title"] === "" ? item["sorttitle"] : item["title"])
                                    }
                                </a><br/>
                                <span className="ncbi-search-item-author">Last Author: {item["lastauthor"]}</span><br/>
                                <span className="ncbi-search-item-date">Publication Date: {item["pubdate"]} </span>
                            </div>
                        ))
                    }

                </div>
            </div>
        )
    }
}

export default SearchResultsComponent;