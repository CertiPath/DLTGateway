import { Box, CheckSquare, FileText, Edit, Trash2 } from "react-feather";
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row } from "reactstrap";
import { toastr } from 'react-redux-toastr';
import React, { Component, Fragment } from "react";
import Select from "react-select";
import { NavLink } from "react-router-dom";

import { Formik, Field, Form } from "formik";
import * as Yup from "yup";


import Spinner from "../../components/spinner/spinner";
import apiClient from "../../utility/apiClient";

import ConfirmEnableDisable from "../../components/businessnetwork/modalConfirmEnableDisable";
import NamespaceTable  from "../../views/businessnetwork/namespaceTable";
import ConfirmDelete from "../../components/common/modal/ConfirmDialog";
import ConnectionFilesCard from "../../components/cards/businessNetwork/connectionFilesCard";

const formBasicDetailsSchema = Yup.object().shape({
    Name: Yup.string()
        .required()
        .max(50),
    ChannelName: Yup.string()
        .required()
        .max(100),
    Username: Yup.string()
        .required()
        .max(100),
    PeerAddress: Yup.string()
        .required()
        .max(100),
    BlockchainFrameworkGUID: Yup.string()
        .required()
});

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
        businessNetworkData: null,
        FormikTest: null
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
        this.setState({
            BusinessNetworkGUID: nextProps.match.params.id
        })
        if (nextProps.match.params.id.toUpperCase() == 'NEW') {
            this.loadMetadata();
        }
        else {
            this.reloadPage();
        }
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
                res.data.BlockchainFrameworkGUID = '';
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
        });
    }

    saveBasicInformation(details) {
        
        const page = this;
        
        // validate first
        formBasicDetailsSchema
            .isValid(details)
            .then(function (valid) {
                if (valid) {
                    apiClient.post('BusinessNetwork/Save', {
                        GUID: page.state.BusinessNetworkGUID.toUpperCase() == 'NEW' ? null : page.state.BusinessNetworkGUID,
                        //this.props.match.params.id.toUpperCase() == 'NEW' ? null : this.props.match.params.id,
                        Name: details.Name,
                        ChannelName: details.ChannelName,
                        PeerAddress: details.PeerAddress,
                        BlockchainFrameworkGUID: details.BlockchainFrameworkGUID,
                        Username: details.Username

                    })
                        .then(res => {
                            page.setState({
                                BusinessNetworkGUID: res.data.Key
                            })
                            toastr.success('Success', 'Business network successfully saved.', { position: 'top-right' });
                        })
                        .catch(function (error) {
                            toastr.error('Error', 'There was an error trying to save business network.', { position: 'top-right' });
                        });
                }
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
                                        <Formik
                                            enableReinitialize
                                            initialValues={this.state.businessNetworkData}
                                            validationSchema={formBasicDetailsSchema}
                                            onSubmit={values => {
                                                this.saveBasicInformation(values);
                                            }}
                                        >
                                            {props =>(
                                                <Form className="form-horizontal">
                                                    <div className="form-body">
                                                        <h4 className="form-section"><Box size={20} color="#212529" /> Basic Details
                                                {
                                                                this.state.BusinessNetworkGUID.toUpperCase() == 'NEW' ? '' :
                                                                    (
                                                                        <Row className="float-right">
                                                                            <Col md="6">
                                                                                <ConfirmEnableDisable
                                                                                    Name={props.values.Name}
                                                                                    YesButtonAction={() => this.state.businessNetworkData.Disabled == false ? this.handleDisable(this.state.businessNetworkData.GUID) : this.handleEnable(this.state.businessNetworkData.GUID)}
                                                                                    Disabled={this.state.businessNetworkData.Disabled}
                                                                                />
                                                                            </Col>
                                                                            <Col md="6">
                                                                                <ConfirmDelete
                                                                                    Title={"Delete network " + props.values.Name + "?"}
                                                                                    Text={"You are about to delete network " + props.values.Name + ". All associated namespaces and tracked objects will be deleted with it. Are you sure you want to continue?"}
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
                                                                    <Label for="Name">Name</Label>
                                                                    <Field type="text" id="Name" value={props.values.Name}
                                                                        onChange={e => {
                                                                            props.handleChange(e);
                                                                            this.onNameChange(e);
                                                                        }}  name="Name" className={`form-control ${props.errors.Name && props.touched.Name && 'is-invalid'}`} />
                                                                    {props.errors.Name && props.touched.Name ? <div className="invalid-feedback">{props.errors.Name}</div> : null}
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="6">
                                                                <FormGroup>
                                                                    <Label for="BlockchainFrameworkGUID">Framework Type</Label>
                                                                    <Field component="select" onChange={props.handleChange}
                                                                        className={`form-control ${props.errors.BlockchainFrameworkGUID && props.touched.BlockchainFrameworkGUID && 'is-invalid'}`}
                                                                        value={props.values.BlockchainFrameworkGUID}
                                                                        name="BlockchainFrameworkGUID"
                                                                        id="BlockchainFrameworkGUID"
                                                                    >
                                                                        <option key='' value=''>
                                                                        </option>
                                                                        {this.state.businessNetworkData.BlockchainFrameworkList.map(option => (
                                                                            <option key={`basic-${option.value}`} value={option.value}>
                                                                                {option.label}
                                                                            </option>
                                                                        ))}
                                                                    </Field>
                                                                    {props.errors.BlockchainFrameworkGUID && props.touched.BlockchainFrameworkGUID ? <div className="invalid-feedback">{props.errors.BlockchainFrameworkGUID}</div> : null}
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col md="6">
                                                                <FormGroup>
                                                                    <Label for="ChannelName">Channel Name</Label>
                                                                    <Field type="text" id="ChannelName" value={props.values.ChannelName} onChange={props.handleChange}  name="ChannelName" className={`form-control ${props.errors.ChannelName && props.touched.ChannelName && 'is-invalid'}`} />
                                                                    {props.errors.ChannelName && props.touched.ChannelName ? <div className="invalid-feedback">{props.errors.ChannelName}</div> : null}
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="6">
                                                                <FormGroup>
                                                                    <Label for="Username">Username</Label>
                                                                    <Field type="text" id="Username" value={props.values.Username} onChange={props.handleChange}  name="Username" className={`form-control ${props.errors.Username && props.touched.Username && 'is-invalid'}`} />
                                                                    {props.errors.Username && props.touched.Username ? <div className="invalid-feedback">{props.errors.Username}</div> : null}
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col md="12">
                                                                <FormGroup>
                                                                    <Label for="PeerAddress">Peer Address</Label>
                                                                    <Field type="text" id="PeerAddress" value={props.values.PeerAddress} onChange={props.handleChange} name="PeerAddress" className={`form-control ${props.errors.PeerAddress && props.touched.PeerAddress && 'is-invalid'}`} />
                                                                    {props.errors.PeerAddress && props.touched.PeerAddress ? <div className="invalid-feedback">{props.errors.PeerAddress}</div> : null}
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>

                                                        <div className="form-actions bottom clearfix">
                                                            <div className="float-right">
                                                                <Button type="submit" color="primary">
                                                                    <CheckSquare size={16} color="#FFF" /> Save
                                                                </Button>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </Form>
                                            )}
                                        </Formik>
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
