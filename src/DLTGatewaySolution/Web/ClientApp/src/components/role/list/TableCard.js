import React from 'react';
import "react-table/react-table.css";

import { UserX } from "react-feather";
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Table } from "reactstrap";
import { Component, Fragment } from "react";
import Spinner from "../../spinner/spinner";
import { Alert } from "reactstrap";
import { toastr } from 'react-redux-toastr';
import apiClient from "../../../utility/apiClient";
import { NavLink, Link } from "react-router-dom";

export default class Example extends React.Component {

    constructor() {
        super();
        this.state = {
            RoleList: null,
            SelectedRoleGUID: null,
            SelectedRoleName: '',
            RoleSelected: false,
        };
    }

    componentDidMount() {
        this.loadData();
    }
    
    loadData() {
        if (this.props.IsGlobal) {
            apiClient.get('Role/GetAll', {})
                .then(res => {
                    this.setState({
                        RoleList: res.data
                    });
                });
        }
        else {
            apiClient.get('Role/GetAllLocal', {})
                .then(res => {
                    this.setState({
                        RoleList: res.data
                    });
                });
        }
    }

    handleRoleSelected(selectedRoleGUID, selectedRoleName) {
        
        this.setState({
            RoleSelected: true,
            SelectedRoleGUID: selectedRoleGUID,
            SelectedRoleName: selectedRoleName
        });
        this.props.OnRoleSelected(selectedRoleGUID, selectedRoleName);
    }

    render() {
        let rows = this.state.RoleList == null ? '<div></div>' : this.state.RoleList.map(role => {
            return (
                <tr>
                    <td><Link to="#" onClick={() => this.handleRoleSelected(role.GUID, role.Name)}>{role.Name}</Link></td>
                    <td hidden={this.state.RoleSelected}>{role.Description}</td>
                    <td width="200px" hidden={this.state.RoleSelected}>
                        <Button
                            className="btn-sm"
                            style={{ margin: '0px 0px 0px 0px' }}
                            onClick={() => this.handleRoleSelected(role.GUID, role.Name)}>
                            View Associated Groups
                        </Button>
                    </td>
                </tr>
            )
        });

        return (

            rows.length === 0 ?
                (
                    <div>
                        <div className="px-3">
                            <Form className="form-horizontal">
                                <div className="form-body">
                                    <Alert color="dark">
                                        There are no global roles configured in the system. Contact support.
                                     </Alert>
                                </div>
                            </Form>
                        </div>
                    </div>
                )
                :
                (this.state.RoleList == null ? (<Spinner />) : (
                    <Card>
                        <CardBody>
                            <div className="px-3">
                                <Form className="form-horizontal">
                                    <div className="form-body">

                                        {
                                            this.props.IsGlobal == true ? (<h4 className="form-section"><UserX size={20} color="#212529" /> Global Roles</h4>) : (<h4 className="form-section"><UserX size={20} color="#212529" /> Local Roles</h4>)
                                        }
                                        
                                        <Table striped responsive>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th hidden={this.state.RoleSelected}>Description</th>
                                                    <th width="200px" hidden={this.state.RoleSelected}>View Associated Groups</th>
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
                    </Card>
                    )
                )
        );
    }
}