import "react-table/react-table.css";

import React from "react";
// Import React Table
import ReactTable from "react-table";
import { NavLink } from "react-router-dom";
import apiClient from '../../utility/apiClient';

const requestData = (pageSize, page, sorted, filtered) => {

    return apiClient.post('User/GetAll', {
        "PageSize": pageSize,
        "PageNumber": page,
        "FilterList": filtered,
        "SortList": sorted
    });
};

export default class Example extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            pages: null,
            loading: true
        };
        this.fetchData = this.fetchData.bind(this);
    }
    fetchData(state, instance) {
        this.setState({ loading: true });
        requestData(
            state.pageSize,
            state.page,
            state.sorted,
            state.filtered
        ).then(res => {
            this.setState({
                data: res.data.List,
                pages: Math.ceil(res.data.TotalCount / state.pageSize),
                loading: false
            });
            })
            .catch(function (error) {
                alert(error);
            })
    }
    render() {
        const { data, pages, loading } = this.state;
        return (
            <div>
                <ReactTable
                    columns={[
                        {
                            Header: "First Name",
                            accessor: "FirstName"
                        },
                        {
                            Header: "Last Name",
                            accessor: "LastName"
                        },
                        {
                            Header: "Username",
                            accessor: "Username",
                        },
                        {
                            Header: "Last Login",
                            accessor: "LastLogin",
                        }
                    ]}
                    manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                    data={data}
                    pages={pages} // Display the total number of pages
                    loading={loading} // Display the loading overlay when we need it
                    onFetchData={this.fetchData} // Request new data when things change
                    filterable
                    defaultPageSize={10}
                    className="-striped -highlight"
                />
            </div>
        );
    }
}