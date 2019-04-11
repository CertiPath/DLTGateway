import { Box, CheckSquare, FileText, Edit, Trash2 } from "react-feather";
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row, Form } from "reactstrap";
import { toastr } from 'react-redux-toastr';
import React, { Component, Fragment } from "react";
import Select from "react-select";
import { NavLink, Link } from "react-router-dom";

import Spinner from "../../components/spinner/spinner";
import apiClient from "../../utility/apiClient";


class BusinessNetworkObject extends Component {
    constructor(props) {
        super(props);
        // Bind the this context to the handler function

        /*
        this.reloadPage = this.reloadPage.bind(this);
        this.loadMetadata = this.loadMetadata.bind(this);
        this.saveBasicInformation = this.saveBasicInformation.bind(this);
        this.handleClickDelete = this.handleClickDelete.bind(this);
        */

        this.state = {
            ObjectDetails: null,
            ObjectGUID: props.match.params.id
        };
    }

    componentDidMount() {
        this.loadDetails(this.state.ObjectGUID);
    }

    loadDetails(objGUID) {
        apiClient.get('DataStore/Get?GUID=' + objGUID, {})
            .then(res => {

                this.setState({
                    ObjectDetails: res.data
                });
            });
    }

    render() {
        
        let rows = this.state.ObjectDetails == null ? '<div></div>' : this.state.ObjectDetails.PropertyValues.map(item => {
            return (
                <li>
                    <span className="text-bold-500 primary">
                        <Link to="/pages/useer-profile">{item.Name}</Link>
                    </span>
                    <span className="display-block overflow-hidden">{item.Value}</span>
                </li>
            )
        });

        return (
            this.state.ObjectDetails != null ? (
                <Fragment>
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <NavLink to="/DataStore">Data Store</NavLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>Object Details</BreadcrumbItem>
                    </Breadcrumb>

                    <Row>
                        <Col sm="12" md="3">
                            <Card>
                                <CardBody>
                                    <div className="px-3">
                                        <Form className="form-horizontal">
                                            <div className="form-body">
                                                <h4 className="form-section"><Box size={20} color="#212529" /> Object Properties</h4>

                                                <Row>
                                                    <Col xs="12" md="12" lg="12">
                                                        <ul className="no-list-style">
                                                            {rows}      
                                                        </ul>
                                                    </Col>
                                                </Row>

                                            </div>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col sm="12" md="9">
                            <Card>
                                <CardBody>
                                    <div className="px-3">
                                        <Form className="form-horizontal">
                                            <div className="form-body">
                                                <h4 className="form-section"><Box size={20} color="#212529" /> Data Views</h4>

                                                TODO
                                                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />

                                            </div>
                                        </Form>
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

export default BusinessNetworkObject;
