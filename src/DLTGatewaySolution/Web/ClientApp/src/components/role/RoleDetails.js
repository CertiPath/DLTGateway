// import external modules
import React, { Component, Fragment } from "react";
import { Lock } from "react-feather";
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Table } from "reactstrap";
import { toastr } from 'react-redux-toastr';
import apiClient from '../../utility/apiClient';
import Spinner from "../../components/spinner/spinner";
import { NavLink, Link } from "react-router-dom";
import { Alert } from "reactstrap";
import ConfirmDelete from "../../components/common/modal/ConfirmDialog";
import AddADGroup from "../../components/role/modalAddActiveDirectoryGroup";

class RoleDetails extends Component {

    constructor(props) {
        super();

        this.handleClickDelete = this.handleClickDelete.bind(this);
        this.onFinishedAddGroup = this.onFinishedAddGroup.bind(this);
        
        this.state = {
            RoleGUID: null,
            UserGroups: null
        };
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            RoleGUID: nextProps.SelectedRoleGUID,
            UserGroups: null
        });
        this.loadData(nextProps.SelectedRoleGUID);
    }

    loadData(roleGUID) {
        apiClient.get('Role/GetUserGroups?RoleGUID=' + roleGUID, {})
            .then(res => {
                this.setState({
                    UserGroups: res.data
                });
            });
    }

    onFinishedAddGroup(roleGUID) {
        this.loadData(roleGUID);
    }

    handleClickDelete(GUID) {
        apiClient.post('Role/DeleteUserGroup', {
            GUID: GUID
        })
            .then(res => {
                toastr.success('Success', 'Group successfully removed.', { position: 'top-right' });
                this.loadData(this.state.RoleGUID);
            })
            .catch(function (error) {
                toastr.error('Error', 'There was an error trying to remove group.', { position: 'top-right' });
            });
    }

    render() {

        let rows = this.state.UserGroups == null ? '<div></div>' : this.state.UserGroups.map(group => {
            return (
                <tr>
                    <td>{group.UserGroupName}</td>
                    <td >{group.UserGroupSID}</td>
                    <td style={{ paddingLeft: 0, paddingRight: 0, cursor: 'pointer' }} title="Remove Group">
                        <ConfirmDelete
                            Title={"Remove group: " + group.UserGroupName + "?"}
                            Text={"You are about to remove group '" + group.UserGroupName + "' from role '" + group.RoleName + "'. Any users belonging to this group will be removed from the role. Are you sure you want to continue?"}
                            YesButtonText="Remove"
                            YesButtonAction={() => this.handleClickDelete(group.GUID)}
                        />
                    </td>
                </tr>
            )
        });

        return (
            this.state.UserGroups == null ? (<Spinner />) :
                (
                    <Card>
                        <CardBody>
                            <div className="px-3">
                                <Form className="form-horizontal">
                                    <div className="form-body">
                                        <h4 className="form-section"><Lock size={20} color="#212529" /> {this.props.SelectedRoleName} - User Groups</h4>

                                        {
                                            rows.length == 0 ? (
                                                <div>
                                                    <div className="px-3">
                                                        <Form className="form-horizontal">
                                                            <div className="form-body">
                                                                <Alert color="dark">
                                                                    There are no user groups associated with this role. Click on Add New Group to start associating groups.
                                                                </Alert>
                                                            </div>
                                                        </Form>
                                                    </div>
                                                </div>):
                                                (
                                                    <Table striped responsive>
                                                        <thead>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>SID</th>
                                                                <th>Delete</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {rows}
                                                        </tbody>
                                                    </Table>           
                                                )
                                        }

                                        <div className="form-actions">
                                            <div className="float-right">
                                                <AddADGroup
                                                    RoleGUID={this.state.RoleGUID}
                                                    ReloadListAction={this.onFinishedAddGroup}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </CardBody>
                    </Card>
                )
            
        )
    }
}

export default RoleDetails;
