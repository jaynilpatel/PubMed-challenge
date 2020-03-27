import React from "react";

class AdvancedSearchComponent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            startDate: "",
            endDate: "",
            datetype: "mod",
        }
    }

    /**
     * Apply filter
     * @param days
     */
    quickFilter = days => {
        this.props.history.push({
            search: `?keywords=${this.props.searchTerm}&quick-filter=${days}`
        });
    };

    /**
     * Apply advanced search
     * @param e
     */
    applyAdvancedSearch = (e) => {
        e.preventDefault();
        this.props.history.push({
                search: `?keywords=${this.props.searchTerm}&min-date=` +
                        `${this.state.startDate}&max-date=${this.state.endDate}` +
                        `&datetype=${this.state.datetype}`
            });
    };



    render() {
        return (
            <div className="">
                <span className="ncbi-banner-title">Advanced Search</span>
                <hr/>
                <span className="ncbi-advanced-search-item-title">
                    Quick filters:
                    <ul className="ncbi-quick-filter">
                        <li><span onClick={() => this.quickFilter(7)}>Last 7 days</span></li>
                        <li><span onClick={() => this.quickFilter(14)}>Last 14 days</span></li>
                        <li><span onClick={() => this.quickFilter(30)}>Last 30 days</span></li>
                    </ul>
                </span>
                <hr/>
                <form className="form-group" onSubmit={(e) => this.applyAdvancedSearch(e)}>
                    <div className="ncbi-advanced-search-form-body">

                        <h6>Search by date:</h6>
                        <label htmlFor="mod">
                            <input onChange={(e) =>
                                this.setState({
                                    datetype: e.currentTarget.value
                                              })
                            }
                                type="radio" id="mod" name="datetype" value="mod" checked={this.state.datetype === "mod"}/>
                            &nbsp;Modified Date
                        </label>&nbsp;
                        <label htmlFor="pub">
                            <input onChange={(e) =>
                                this.setState({
                                                  datetype: e.currentTarget.value
                                              })
                            }
                                type="radio" id="pub" name="datetype" value="pub"/>
                            &nbsp;Published Date
                        </label>
                        <br/>
                        <label htmlFor="min-date">Start:&nbsp;
                            <input  onChange={(e) => {
                                this.setState({
                                                  startDate: e.target.value
                                              })
                            }}
                            className="ncbi-date-input" type="date" id="min-date" name="min-date"/>

                        </label>
                        <label htmlFor="max-date">End:&nbsp;&nbsp;
                            <input  onChange={(e) => {
                                this.setState({
                                                  endDate: e.target.value
                                              })
                            }}
                                    className="ncbi-date-input" type="date" id="max-date" name="max-date"/>
                        </label>
                        <br/>
                        <input className="form-control" type="submit" value="Apply"/>
                    </div>
                </form>
            </div>
        )
    }
}

export default AdvancedSearchComponent;