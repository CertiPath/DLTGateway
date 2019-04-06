import React from 'react';
import { connect } from 'react-redux';

import "react-table/react-table.css";

import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Box, CheckSquare, FileText, Edit, Trash2 } from "react-feather";
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Component, Fragment } from "react";
import Spinner from "../../components/spinner/spinner";
import { toastr } from 'react-redux-toastr';
import apiClient from "../../utility/apiClient";
import { NavLink } from "react-router-dom";

import TrackedObjectList from "../../components/businessNetworkNamespace/trackedObjectList";

class BusinessNetworkNamespace extends React.Component {

    constructor(props) {
        super(props);
        // Bind the this context to the handler function
        //this.onEditNetworkClick = this.onEditNetworkClick.bind(this);
        //this.handleClickDelete = this.handleClickDelete.bind(this);
        this.loadData = this.loadData.bind(this);

        this.state = {
            NamespaceDetails: null
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        apiClient.get('BusinessNetworkNamespace/GetDetails?GUID=' + this.props.match.params.id, {})
            .then(res => {
                this.setState({
                    NamespaceDetails: res.data
                });
            });
    }

    render() {
        
        return (
            this.state.NamespaceDetails == null ? (
                <Spinner></Spinner>  
            ) :
            (
            <Fragment>
                <Breadcrumb>
                <BreadcrumbItem>
                    <NavLink to="/BusinessNetwork/List">Business Network List</NavLink>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    <NavLink to={"/BusinessNetwork/Details/" + this.state.NamespaceDetails.NetworkGUID}>{this.state.NamespaceDetails.NetworkName}</NavLink>
                </BreadcrumbItem>
                <BreadcrumbItem active>{this.state.NamespaceDetails.NamespaceName}</BreadcrumbItem>
                </Breadcrumb>

                <Row>
                    <Col sm="12" md="5">
                        <Card>
                            <CardBody>
                                <div className="px-3">
                                    <Form className="form-horizontal">
                                        <div className="form-body">
                                            <h4 className="form-section"><FileText size={20} color="#212529" /> Namespace Details</h4>

                                            <Row>
                                                <Col md="6">
                                                    <FormGroup>
                                                        <Label for="txtName">Name</Label>
                                                        <Input type="text" id="txtName" value='' className="border-primary" name="name" />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6">
                                                            
                                                </Col>
                                            </Row>
                                            <h4 className="form-section"><Box size={20} color="#212529" /> Tracked Objects
                                            </h4>
                                            <TrackedObjectList
                                                BusinessNetworkNamespaceGUID={this.state.NamespaceDetails.NamespaceGUID}
                                            />
                                        </div>
                                    </Form>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm="12" md="7">
                        <Card>
                            <CardBody>
                                <div className="px-3">
                                    <Form className="form-horizontal">
                                        <div className="form-body">
                                            <h4 className="form-section"><FileText size={20} color="#212529" /> Object Details</h4>
                                                    
                                        </div>
                                    </Form>
                                </div>
                            </CardBody>
                        </Card> 
                    </Col>
                </Row>
            </Fragment>
            )
        )
    }
}

export default BusinessNetworkNamespace;