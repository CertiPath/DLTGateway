import { Box, CheckSquare, FileText, Edit, Trash2 } from "react-feather";
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row, Nav, NavItem, NavLink, TabPane, TabContent } from "reactstrap";
import { toastr } from 'react-redux-toastr';
import React, { Component, Fragment } from "react";
import Select from "react-select";
import { NavLink as NavLink2 } from "react-router-dom";
import classnames from "classnames";

import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import Spinner from "../../components/spinner/spinner";
import apiClient from "../../utility/apiClient";

import ConfirmEnableDisable from "../../components/businessnetwork/modalConfirmEnableDisable";
import NamespaceTable  from "../../views/businessnetwork/namespaceTable";
import ConfirmDelete from "../../components/common/modal/ConfirmDialog";
import ConnectionFilesCard from "../../components/cards/businessNetwork/connectionFilesCard";

import RoleTableCard from "../../components/role/list/TableCard";
import RoleDetails from "../../components/role/RoleDetails";

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
        .when("BlockchainFrameworkGUID", {
            is: (val) => val.toUpperCase() == '77FC57A8-08D3-4542-9700-0D3F3E01E628',
            then: Yup.string().required().max(100)
        }),
    Endpoint: Yup.string()
        .when("BlockchainFrameworkGUID", {
            is: (val) => val.toUpperCase() == '69BEF4F9-0342-45B4-A557-4B4B74C5A471',
            then: Yup.string().required().max(250)
        }),
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
        this.OnRoleSelected = this.OnRoleSelected.bind(this);

        this.state.BusinessNetworkGUID = this.props.match.params.id;
    }

    state = {
        activeTab: "1",
        BusinessNetworkGUID: 'New',
        BusinessNetworkType: '',
        businessNetworkDetails: null,
        businessNetworkData: null,
        FormikTest: null,
        SelectedRoleGUID: null,
        SelectedRoleName: ''
    }

    toggleTab = tab => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    };

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
                    businessNetworkData: res.data,
                    BusinessNetworkType: res.data.BlockchainFrameworkName
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
                    businessNetworkData: res.dat
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

    onTypeChange(event) {
        // TODO: change this - must lookup the values or something of that kind
        const inputName = event.target.value.toUpperCase();
        let type = '';
        if (inputName == '77FC57A8-08D3-4542-9700-0D3F3E01E628') {
            type = 'HLF';
        }
        else if (inputName == '69BEF4F9-0342-45B4-A557-4B4B74C5A471') {
            type = 'ETH';
        }
        this.setState({
            BusinessNetworkType: type
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
                        Name: details.Name,
                        ChannelName: details.ChannelName,
                        PeerAddress: details.PeerAddress,
                        BlockchainFrameworkGUID: details.BlockchainFrameworkGUID,
                        Username: details.Username,
                        Endpoint: details.Endpoint

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

    OnRoleSelected(selectedRoleGUID, selectedRoleName) {
        this.setState({
            SelectedRoleGUID: selectedRoleGUID,
            SelectedRoleName: selectedRoleName
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
                            <NavLink2 to="/BusinessNetwork/List">Business Network List</NavLink2>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>{this.state.businessNetworkData.Name == '' ? 'New' : this.state.businessNetworkData.Name}</BreadcrumbItem>
                    </Breadcrumb>

                    <Row>
                        <Col sm="12" md="12">
                            <Card>
                                <CardBody>

                                    <div>
                                        <Nav tabs className="nav-border-bottom">
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({
                                                        active: this.state.activeTab === "1"
                                                    })}
                                                    onClick={() => {
                                                        this.toggleTab("1");
                                                    }}
                                                >
                                                    Basic Details & Credential Files
                                            </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({
                                                        active: this.state.activeTab === "2"
                                                    })}
                                                    onClick={() => {
                                                        this.toggleTab("2");
                                                    }}
                                                >
                                                    Tracked Namespaces
                                            </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({
                                                        active: this.state.activeTab === "3"
                                                    })}
                                                    onClick={() => {
                                                        this.toggleTab("3");
                                                    }}
                                                >
                                                    Roles/Permissions
                                            </NavLink>
                                            </NavItem>
                                        </Nav>
                                        <TabContent activeTab={this.state.activeTab}>
                                            <TabPane tabId="1">
                                                <Row>
                                                    <Col sm="12" md="6">
                                                        <div className="px-3">
                                                            <Formik
                                                                enableReinitialize
                                                                initialValues={this.state.businessNetworkData}
                                                                validationSchema={formBasicDetailsSchema}
                                                                onSubmit={values => {
                                                                    this.saveBasicInformation(values);
                                                                }}
                                                            >
                                                                {props => (
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
                                                                                            }} name="Name" className={`form-control ${props.errors.Name && props.touched.Name && 'is-invalid'}`} />
                                                                                        {props.errors.Name && props.touched.Name ? <div className="invalid-feedback">{props.errors.Name}</div> : null}
                                                                                    </FormGroup>
                                                                                </Col>
                                                                                <Col md="6">
                                                                                    <FormGroup>
                                                                                        <Label for="BlockchainFrameworkGUID">Framework Type</Label>
                                                                                        <Field component="select" onChange={e => {
                                                                                            props.handleChange(e);
                                                                                            this.onTypeChange(e);
                                                                                        }}
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
                                                                            {
                                                                                this.state.BusinessNetworkType == 'HLF' ?
                                                                                    (
                                                                                        <Row>
                                                                                            <Col md="6">
                                                                                                <FormGroup>
                                                                                                    <Label for="ChannelName">Channel Name</Label>
                                                                                                    <Field type="text" id="ChannelName" value={props.values.ChannelName} onChange={props.handleChange} name="ChannelName" className={`form-control ${props.errors.ChannelName && props.touched.ChannelName && 'is-invalid'}`} />
                                                                                                    {props.errors.ChannelName && props.touched.ChannelName ? <div className="invalid-feedback">{props.errors.ChannelName}</div> : null}
                                                                                                </FormGroup>
                                                                                            </Col>
                                                                                            <Col md="6">
                                                                                                <FormGroup>
                                                                                                    <Label for="Username">Username</Label>
                                                                                                    <Field type="text" id="Username" value={props.values.Username} onChange={props.handleChange} name="Username" className={`form-control ${props.errors.Username && props.touched.Username && 'is-invalid'}`} />
                                                                                                    {props.errors.Username && props.touched.Username ? <div className="invalid-feedback">{props.errors.Username}</div> : null}
                                                                                                </FormGroup>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    )
                                                                                    : ("")
                                                                            }
                                                                            <Row>
                                                                                {
                                                                                    this.state.BusinessNetworkType == 'HLF' ?
                                                                                        (
                                                                                            <Col md="12">
                                                                                                <FormGroup>
                                                                                                    <Label for="PeerAddress">Peer Address</Label>
                                                                                                    <Field type="text" id="PeerAddress" value={props.values.PeerAddress} onChange={props.handleChange} name="PeerAddress" className={`form-control ${props.errors.PeerAddress && props.touched.PeerAddress && 'is-invalid'}`} />
                                                                                                    {props.errors.PeerAddress && props.touched.PeerAddress ? <div className="invalid-feedback">{props.errors.PeerAddress}</div> : null}
                                                                                                </FormGroup>
                                                                                            </Col>
                                                                                        )
                                                                                        : ("")
                                                                                }
                                                                                {
                                                                                    this.state.BusinessNetworkType == 'ETH' ?
                                                                                        (
                                                                                            <Col md="12">
                                                                                                <FormGroup>
                                                                                                    <Label for="Endpoint">Endpoint</Label>
                                                                                                    <Field type="text" id="Endpoint" value={props.values.Endpoint} onChange={props.handleChange} name="Endpoint" className={`form-control ${props.errors.Endpoint && props.touched.Endpoint && 'is-invalid'}`} />
                                                                                                    {props.errors.Endpoint && props.touched.Endpoint ? <div className="invalid-feedback">{props.errors.Endpoint}</div> : null}
                                                                                                </FormGroup>
                                                                                            </Col>
                                                                                        )
                                                                                        : ("")
                                                                                }
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
                                                    </Col>
                                                    <Col sm="12" md="6">
                                                        {
                                                            this.state.BusinessNetworkGUID.toUpperCase() == 'NEW' || this.state.BusinessNetworkType != 'HLF' ? '' :
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
                                                </Row>
                                            </TabPane>
                                            <TabPane tabId="2">
                                                <Row>
                                                    <Col sm="12" md="12">
                                                        <NamespaceTable
                                                            BusinessNetworkGUID={this.state.BusinessNetworkGUID}
                                                            ShowHeader={false}
                                                        />
                                                    </Col>
                                                </Row>
                                            </TabPane>
                                            <TabPane tabId="3">
                                                <Row>
                                                    <Col sm="12" md={this.state.SelectedRoleGUID == null ? "12" : "3"}>
                                                        <RoleTableCard
                                                            IsGlobal={true}
                                                            OnRoleSelected={this.OnRoleSelected}
                                                        />
                                                    </Col>
                                                    <Col sm="12" md="9" style={this.state.SelectedRoleGUID == null ? { display: 'none' } : {}}>
                                                        <RoleDetails
                                                            SelectedRoleGUID={this.state.SelectedRoleGUID}
                                                            SelectedRoleName={this.state.SelectedRoleName}
                                                        />
                                                    </Col>
                                                </Row>
                                            </TabPane>
                                        </TabContent>
                                    </div>
                                </CardBody>
                            </Card>
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
