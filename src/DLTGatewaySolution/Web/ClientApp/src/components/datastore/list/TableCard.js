import "react-table/react-table.css";

import React from "react";
// Import React Table
import ReactTable from "react-table";
import ValueModal from "./ValueModal";
import apiClient from '../../../utility/apiClient';

const requestData = (pageSize, page, sorted, filtered) => {

    return apiClient.post('DataStore/GetAll', {
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
        // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
        // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
        this.setState({ loading: true });
        // Request the data however you want.  Here, we'll use our mocked service we created earlier
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
                            Header: "Business Namespace",
                            accessor: "BusinessNetworkNamespaceName"
                        },
                        {
                            Header: "Object Name",
                            accessor: "BusinessNetworkObjectName"
                        },
                        {
                            Header: "Source ID",
                            accessor: "DataStoreSourceID",
                        },
                        {
                            Header: "View",
                            width: 100,
                            sortable: false,
                            filterable: false,
                            accessor: "DataStoreValue",
                            Cell: row => (
                                <div style={{
                                    textAlign: "center"
                                }}>
                                    <ValueModal
                                        text={JSON.stringify(JSON.parse(row.value), null, 2)}
                                    />
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
                    defaultPageSize={10}
                    className="-striped -highlight"
                />
            </div>
        );
    }
}