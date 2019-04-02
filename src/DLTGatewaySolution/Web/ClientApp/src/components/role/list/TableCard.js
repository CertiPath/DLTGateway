import "react-table/react-table.css";

import React from "react";
// Import React Table
import ReactTable from "react-table";
import apiClient from '../../../utility/apiClient';
import { NavLink } from "react-router-dom";
import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";

const requestData = (pageSize, page, sorted, filtered) => {

    return apiClient.post('Role/GetAll', {
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
                            Header: "Name",
                            accessor: "Name"
                        },
                        {
                            Header: "Description",
                            accessor: "Description",
                            sortable: false,
                            filterable: false,
                        },
                        {
                            Header: "System Role",
                            accessor: "IsSystemRole",
                            sortable: false,
                            filterable: false,
                        },
                        {
                            Header: "View",
                            width: 100,
                            sortable: false,
                            filterable: false,
                            accessor: "GUID",
                            Cell: row => (
                                <div style={{
                                    textAlign: "center"
                                }}>
                                    <NavLink to={'/businessnetwork/details/' + row.GUID}>
                                        <Button color="primary" size="sm" style={{ margin: 0 }}>
                                            View
                                        </Button>
                                    </NavLink>
                                </div>
                            )
                        }
                    ]}
                    manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                    data={data}
                    pages={pages} // Display the total number of pages
                    loading={loading} // Display the loading overlay when we need it
                    onFetchData={this.fetchData} // Request new data when things change
                    filterable
                    defaultPageSize={5}
                    className="-striped -highlight"
                />
            </div>
        );
    }
}