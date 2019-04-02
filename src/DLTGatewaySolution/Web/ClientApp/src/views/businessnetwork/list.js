import "react-table/react-table.css";

import { Box, Edit } from 'react-feather';
import { Form, Button, Card, CardBody, CardTitle, Col, Row, Table } from "reactstrap";
import React, { Fragment } from "react";
import Spinner from "../../components/spinner/spinner";
import { toastr } from 'react-redux-toastr';
import apiClient from "../../utility/apiClient";
import { NavLink } from "react-router-dom";

import ConfirmEnableDisable from "../../components/businessnetwork/modalConfirmEnableDisable";
import ConfirmDelete from "../../components/common/modal/ConfirmDialog";

export default class BusinessNetworkList extends React.Component {
    constructor() {
        super();

        // Bind the this context to the handler function
        this.onEditNetworkClick = this.onEditNetworkClick.bind(this);
        this.handleClickDelete = this.handleClickDelete.bind(this);
        this.loadData = this.loadData.bind(this);
        this.handleEnable = this.handleEnable.bind(this);
        this.handleDisable = this.handleDisable.bind(this);

        this.state = {
            NetworkList: null,
            eggsAreReady: false
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        apiClient.get('BusinessNetwork/GetAll')
            .then(res => {
                this.setState({
                    NetworkList: res.data.List
                });
            });
    }

    onEditNetworkClick = (networkGUID) => {
        this.props.history.push('/businessnetwork/details/' + networkGUID);
    }

    handleClickDelete = (networkGUID) => {

        apiClient.post('BusinessNetwork/Delete', {
            "GUID": networkGUID
        })
            .then(res => {
                toastr.success('Success', 'Network successfully deleted.', { position: 'top-right' });
                this.loadData();
            })
            .catch(function (error) {
                toastr.error('Error', 'There was an error trying to delete network.', { position: 'top-right' });
            });
    }

    handleEnable(networkGUID) {
        apiClient.post('BusinessNetwork/Enable', {
            "GUID": networkGUID
        })
            .then(res => {
                toastr.success('Success', 'Network successfully enabled.', { position: 'top-right' });
                // should just switch the button, but cannot figure out how to do it at the moment
                // so reloading the entire list
                this.loadData();
            })
            .catch(function (error) {
                toastr.error('Error', 'There was an error trying to enable network.', { position: 'top-right' });
            });
    }

    handleDisable(networkGUID) {
        apiClient.post('BusinessNetwork/Disable', {
            "GUID": networkGUID
        })
            .then(res => {
                toastr.success('Success', 'Network successfully disabled.', { position: 'top-right' });
                // should just switch the button, but cannot figure out how to do it at the moment
                // so reloading the entire list
                this.loadData();
            })
            .catch(function (error) {
                toastr.error('Error', 'There was an error trying to disable network.', { position: 'top-right' });
            });
    }
    
    render() {
        let rows = this.state.NetworkList == null ? '<div></div>' : this.state.NetworkList.map(network => {
            return (
                <tr>
                    <td><NavLink to={"/BusinessNetwork/Details/" + network.GUID}>{network.Name}</NavLink></td>
                    <td>{network.BlockchainFrameworkName}</td>
                    <td>{network.ChannelName}</td>
                    <td>
                        <ConfirmEnableDisable
                            Name={network.Name}
                            YesButtonAction={() => network.Disabled == false ? this.handleDisable(network.GUID) : this.handleEnable(network.GUID)}
                            Disabled={network.Disabled}
                        />
                    </td>
                    <td style={{ paddingLeft: 0, paddingRight: 0, cursor: 'pointer' }} title="View/Edit Details">
                        <Edit size={18} className="mr-2" onClick={() => this.onEditNetworkClick(network.GUID)} />
                    </td>
                    <td style={{ paddingLeft: 0, paddingRight: 0, cursor: 'pointer' }} title="Delete Network">
                        <ConfirmDelete
                            Title={"Delete network " + network.Name + "?"}
                            Text={"You are about to delete network " + network.Name + ". All associated namespaces and tracked objects will be deleted with it. Are you sure you want to continue?"}
                            YesButtonText="Delete"
                            YesButtonAction={() => this.handleClickDelete(network.GUID)}
                        />
                    </td>
                </tr>
            )
        });

        return (
            this.state.NetworkList == null ? (<Spinner />) : (
                
            <Card>
                <CardBody>
                    <div className="px-3">
                        <Form className="form-horizontal">
                            <div className="form-body">
                             <h4 className="form-section"><Box size={20} color="#212529" /> Business Networks</h4>
                                    
                                <Table striped responsive>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Framework</th>
                                            <th>Channel Name</th>
                                            <th>Enabled</th>
                                            <th width="18"></th>
                                            <th width="40"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows}
                                    </tbody>
                                </Table>
                            </div>
                        </Form>
                    </div>
                </CardBody>
            </Card>)
        );
    }
}
