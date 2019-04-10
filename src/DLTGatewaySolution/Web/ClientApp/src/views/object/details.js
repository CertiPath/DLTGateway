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
        
        this.state.BusinessNetworkGUID = this.props.match.params.id;
        */
    }

    componentDidMount() {
        /*
        if (this.props.match.params.id.toUpperCase() == 'NEW') {
            this.loadMetadata();
        }
        else {
            this.reloadPage();
        }
        */
    }

    componentWillReceiveProps(nextProps) {
        /*
        this.setState({
            BusinessNetworkGUID: nextProps.match.params.id
        })
        if (nextProps.match.params.id.toUpperCase() == 'NEW') {
            this.loadMetadata();
        }
        else {
            this.reloadPage();
        }
        */
    }

    /*
    reloadPage() {
        apiClient.get('BusinessNetwork/GetDetails?GUID=' + this.state.BusinessNetworkGUID, {})
            .then(res => {
                this.setState({
                    businessNetworkData: res.data
                });
            });
    }
    */
    
    render() {
        
        return (
             1==1 ? (
                <Fragment>
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <NavLink to="/DataStore">Data Store</NavLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>TODO</BreadcrumbItem>
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
                                                            <li className="mb-2">
                                                                <span className="text-bold-500 primary">
                                                                    <Link to="/pages/useer-profile">Birthday:</Link>
                                                                </span>
                                                                <span className="display-block overflow-hidden">June 10th, 1988</span>
                                                            </li>
                                                            <li className="mb-2">
                                                                <span className="text-bold-500 primary">
                                                                    <Link to="/pages/user-profile">Birthplace:</Link>
                                                                </span>
                                                                <span className="d-block overflow-hidden">New Jersey, USA</span>
                                                            </li>
                                                            <li className="mb-2">
                                                                <span className="text-bold-500 primary">
                                                                    <Link to="/pages/user-profile">Lives in:</Link>
                                                                </span>
                                                                <span className="display-block overflow-hidden">Denver, USA</span>
                                                            </li>
                                                            <li className="mb-2">
                                                                <span className="text-bold-500 primary">
                                                                    <Link to="/pages/useer-profile">Birthday:</Link>
                                                                </span>
                                                                <span className="display-block overflow-hidden">June 10th, 1988</span>
                                                            </li>
                                                            <li className="mb-2">
                                                                <span className="text-bold-500 primary">
                                                                    <Link to="/pages/user-profile">Birthplace:</Link>
                                                                </span>
                                                                <span className="d-block overflow-hidden">New Jersey, USA</span>
                                                            </li>
                                                            <li className="mb-2">
                                                                <span className="text-bold-500 primary">
                                                                    <Link to="/pages/user-profile">Lives in:</Link>
                                                                </span>
                                                                <span className="display-block overflow-hidden">Denver, USA</span>
                                                            </li>
                                                            <li className="mb-2">
                                                                <span className="text-bold-500 primary">
                                                                    <Link to="/pages/user-profile">Birthplace:</Link>
                                                                </span>
                                                                <span className="d-block overflow-hidden">New Jersey, USA</span>
                                                            </li>
                                                        </ul>
                                                    </Col>
                                                </Row>

                                            </div>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col sm="12" md="6">
                            Yooooo
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
