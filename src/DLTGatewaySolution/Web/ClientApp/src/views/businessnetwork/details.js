import { Box, CheckSquare, FileText, Edit, Trash2 } from "react-feather";
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { toastr } from 'react-redux-toastr';
import React, { Component, Fragment } from "react";
import Select from "react-select";
import { NavLink } from "react-router-dom";
import Spinner from "../../components/spinner/spinner";
import apiClient from "../../utility/apiClient";

import ConfirmEnableDisable from "../../components/businessnetwork/modalConfirmEnableDisable";
import NamespaceTable  from "../../views/businessnetwork/namespaceTable";
import ConfirmDelete from "../../components/common/modal/ConfirmDialog";
import ConnectionFilesCard from "../../components/cards/businessNetwork/connectionFilesCard";

class BusinessNetworkDetails extends Component {
    constructor(props) {
        super(props);
        // Bind the this context to the handler function
        this.reloadPage = this.reloadPage.bind(this);
        this.loadMetadata = this.loadMetadata.bind(this);
        this.saveBasicInformation = this.saveBasicInformation.bind(this);
        this.handleClickDelete = this.handleClickDelete.bind(this);
        
        this.state.BusinessNetworkGUID = this.props.match.params.id;
    }

    state = {
        BusinessNetworkGUID: 'New',
        businessNetworkDetails: null,
        businessNetworkData: null
    }

    componentDidMount() {
        if (this.props.match.params.id.toUpperCase() == 'NEW') {
            this.loadMetadata();
        }
        else {
            this.reloadPage();
        }
    }

    componentWillReceiveProps(nextProps) {
        //if (nextProps.BusinessNetworkGUID != this.props.BusinessNetworkGUID) {
        if (nextProps.match.params.id.toUpperCase() == 'NEW') {
                this.loadMetadata();
            }
            else {
                this.reloadPage();
            }
        //}
    }

    reloadPage() {
        apiClient.get('BusinessNetwork/GetDetails?GUID=' + this.state.BusinessNetworkGUID, {})
            .then(res => {
                this.setState({
                    businessNetworkData: res.data
                });
            });
    }

    loadMetadata() {

        this.setState({
            businessNetworkData: null
        });
        apiClient.get('BusinessNetwork/GetMetadata', {})
            .then(res => {
                this.setState({
                    businessNetworkData: res.data
                });
            });
    }

    onNameChange(event) {
        const inputName = event.target.value;
        let data = this.state.businessNetworkData;
        data.Name = inputName;
        this.setState({
            businessNetworkData: data
        })
    }

    onChannelNameChange(event) {
        const inputName = event.target.value;
        let data = this.state.businessNetworkData;
        data.ChannelName = inputName;
        this.setState({
            businessNetworkData: data
        })
    }

    onPeerAddressChange(event) {
        const inputName = event.target.value;
        let data = this.state.businessNetworkData;
        data.PeerAddress = inputName;
        this.setState({
            businessNetworkData: data
        })
    }

    onFrameworkTypeChange(event) {
        const inputName = event.value;
        let data = this.state.businessNetworkData;
        data.BlockchainFrameworkGUID = inputName;
        this.setState({
            businessNetworkData: data
        })
    }

    onUsernameChange(event) {
        const inputName = event.target.value;
        let data = this.state.businessNetworkData;
        data.Username = inputName;
        this.setState({
            businessNetworkData: data
        })
    }

    saveBasicInformation() {
        const details = this.state.businessNetworkData;
        apiClient.post('BusinessNetwork/Save', {
            GUID: this.props.match.params.id.toUpperCase() == 'NEW' ? null : this.props.match.params.id,
            Name: details.Name,
            ChannelName: details.ChannelName,
            PeerAddress: details.PeerAddress,
            BlockchainFrameworkGUID: details.BlockchainFrameworkGUID,
            Username: details.Username

        })
        .then(res => {
            this.setState({
                BusinessNetworkGUID: res.data.Key
            })
            toastr.success('Success', 'Business network successfully saved.', { position: 'top-right' });
        })
        .catch(function (error) {
            toastr.error('Error', 'There was an error trying to save business network.', { position: 'top-right' });
        });
    }

    handleClickDelete = (networkGUID) => {

        apiClient.post('BusinessNetwork/Delete', {
            "GUID": networkGUID
        })
            .then(res => {
                toastr.success('Success', 'Network successfully deleted.', { position: 'top-right' });
                this.props.history.push('/BusinessNetwork/List/');
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
                let data = this.state.businessNetworkData;
                data.Disabled = false;
                this.setState({
                    businessNetworkData: data
                })
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
                let data = this.state.businessNetworkData;
                data.Disabled = true;
                this.setState({
                    businessNetworkData: data
                })
            })
            .catch(function (error) {
                toastr.error('Error', 'There was an error trying to disable network.', { position: 'top-right' });
            });
    }

    render() {

        let selectedIndexBlockchainFramework = -1;
        if (this.state.businessNetworkData !== null) {
            for (var i = 0; i < this.state.businessNetworkData.BlockchainFrameworkList.length; i++) {
                if (this.state.businessNetworkData.BlockchainFrameworkList[i].value.toUpperCase() == this.state.businessNetworkData.BlockchainFrameworkGUID.toString().toUpperCase()) {
                    selectedIndexBlockchainFramework = i;
                }
            }
        }

        return (
            this.state.businessNetworkData != null ? (
                <Fragment>
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <NavLink to="/BusinessNetwork/List">Business Network List</NavLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>{this.state.businessNetworkData.Name == '' ? 'New' : this.state.businessNetworkData.Name}</BreadcrumbItem>
                    </Breadcrumb>

                    <Row>
                        <Col sm="12" md="6">
                            <Card>
                                <CardBody>
                                    <div className="px-3">
                                        <Form className="form-horizontal">
                                            <div className="form-body">
                                                <h4 className="form-section"><Box size={20} color="#212529" /> Basic Details
                                                {
                                                        this.state.BusinessNetworkGUID.toUpperCase() == 'NEW' ? '' :
                                                            (
                                                                <Row className="float-right">
                                                                    <Col md="6">
                                                                        <ConfirmEnableDisable
                                                                            Name={this.state.businessNetworkData.Name}
                                                                            YesButtonAction={() => this.state.businessNetworkData.Disabled == false ? this.handleDisable(this.state.businessNetworkData.GUID) : this.handleEnable(this.state.businessNetworkData.GUID)}
                                                                            Disabled={this.state.businessNetworkData.Disabled}
                                                                        />
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <ConfirmDelete
                                                                            Title={"Delete network " + this.state.businessNetworkData.Name + "?"}
                                                                            Text={"You are about to delete network " + this.state.businessNetworkData.Name + ". All associated namespaces and tracked objects will be deleted with it. Are you sure you want to continue?"}
                                                                            YesButtonText="Delete"
                                                                            YesButtonAction={() => this.handleClickDelete(this.state.businessNetworkData.GUID)}
                                                                            IconSize={24}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                            )
                                                    }
                                                </h4>

                                                <Row>
                                                    <Col md="6">
                                                        <FormGroup>
                                                            <Label for="txtName">Name</Label>
                                                            <Input type="text" id="txtName" value={this.state.businessNetworkData.Name} onChange={this.onNameChange.bind(this)} className="border-primary" name="name" />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md="6">
                                                        <FormGroup>
                                                            <Label for="ddlFrameworkType">Framework Type</Label>
                                                            <Select onChange={this.onFrameworkTypeChange.bind(this)}
                                                                className="basic-single"
                                                                classNamePrefix="select"
                                                                defaultValue={this.state.businessNetworkData.BlockchainFrameworkList[selectedIndexBlockchainFramework]}
                                                                name="BlockchainFrameworkType"
                                                                options={this.state.businessNetworkData.BlockchainFrameworkList}
                                                            />

                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md="6">
                                                        <FormGroup>
                                                            <Label for="txtChannelName">Channel Name</Label>
                                                            <Input type="text" id="txtChannelName" value={this.state.businessNetworkData.ChannelName} onChange={this.onChannelNameChange.bind(this)} className="border-primary" name="channelname" />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md="6">
                                                        <FormGroup>
                                                            <Label for="txtUsername">Username</Label>
                                                            <Input type="text" id="txtUsername" value={this.state.businessNetworkData.Username} onChange={this.onUsernameChange.bind(this)} className="border-primary" name="peeraddress" />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md="12">
                                                        <FormGroup>
                                                            <Label for="txtPeerAddress">Peer Address</Label>
                                                            <Input type="text" id="txtPeerAddress" value={this.state.businessNetworkData.PeerAddress} onChange={this.onPeerAddressChange.bind(this)} className="border-primary" name="peeraddress" />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>

                                                <div className="form-actions bottom clearfix">
                                                    <div className="float-right">
                                                        <Button color="primary" onClick={this.saveBasicInformation}>
                                                            <CheckSquare size={16} color="#FFF" /> Save
                                                        </Button>
                                                    </div>
                                                </div>

                                            </div>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>
                            {
                                this.state.BusinessNetworkGUID.toUpperCase() == 'NEW' ? '' : 
                                    (
                                        <ConnectionFilesCard
                                            HandleFileUploaded={this.reloadPage}
                                            HandleFileDeleted={this.reloadPage}
                                            BusinessNetworkGUID={this.state.BusinessNetworkGUID}
                                            FileList={this.state.businessNetworkData.FileUploadList}
                                        />
                                    )
                            }
                        </Col>
                        <Col sm="12" md="6">
                            <NamespaceTable
                                BusinessNetworkGUID={this.state.BusinessNetworkGUID}
                            />
                        </Col>
                    </Row>

                </Fragment>
            ) : (
                    <div><Spinner /></div>
                )
        );
    }
}

export default BusinessNetworkDetails;
