import "react-table/react-table.css";

import React from "react";
import { toastr } from 'react-redux-toastr';
import { File, Edit, Trash2, CheckSquare } from 'react-feather';
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Table } from "reactstrap";
import Spinner from "../../components/spinner/spinner";
import { Alert } from "reactstrap";
import { NavLink, Link } from "react-router-dom";

import apiClient from "../../utility/apiClient";
import ConfirmDelete from "../../components/common/modal/ConfirmDialog";
import AddEditObject from "../../components/businessNetworkObject/modalAddEditObject";

export default class TrackedObjectList extends React.Component {
    constructor(props) {
        
        super();

        // Bind the this context to the handler function
        this.handleClickSelected = this.handleClickSelected.bind(this);
        this.handleClickDelete = this.handleClickDelete.bind(this);
        this.onFinishedAddEdit = this.onFinishedAddEdit.bind(this);

        this.state = {
            ObjectList: null,
            ObjectSelected: false,
            BusinessNetworkNamespaceGUID: props.BusinessNetworkNamespaceGUID
        };
    }

    componentDidMount() {
        this.loadData();
    }
    
    loadData() {
        apiClient.get('BusinessNetworkObject/GetAllByNamespace?BusinessNetworkNamespaceGUID=' + this.state.BusinessNetworkNamespaceGUID, {})
            .then(res => {
                this.setState({
                    ObjectList: res.data
                });
            });
    }

    onFinishedAddEdit() {
        this.loadData();
    }

    handleClickSelected = (objGUID, objName) => {
        this.setState({
            ObjectSelected: true
        });
        this.props.OnObjectSelectedClick(objGUID, objName);
    }
    
    handleClickDelete(objGUID) {
        apiClient.post('BusinessNetworkObject/Delete', {
            BusinessNetworkObjectGUID: objGUID
        })
            .then(res => {
                toastr.success('Success', 'Object successfully deleted.', { position: 'top-right' });
                this.loadData();
            })
            .catch(function (error) {
                toastr.error('Error', 'There was an error trying to delete object.', { position: 'top-right' });
            });
    }

    
    render() {
        let rows = this.state.ObjectList == null ? '<div></div>' : this.state.ObjectList.map(obj => {
            return (
                <tr>
                    <td><Link to="#" onClick={() => this.handleClickSelected(obj.BusinessNetworkObjectGUID, obj.BusinessNetworkObjectName)}>{obj.BusinessNetworkObjectName}</Link></td>
                    <td hidden={this.state.ObjectSelected}>{obj.BusinessNetworkObjectClassName}</td>
                    <td>{obj.ObjectCount}</td>
                    <td>
                        <AddEditObject
                            ButtonText="Save"
                            Data={obj}
                            OnFinishedAction={this.onFinishedAddEdit}
                            GUID={null}
                            BusinessNetworkGUID={this.props.BusinessNetworkGUID}
                        />
                    </td>
                    <td style={{ paddingLeft: 0, paddingRight: 0, cursor: 'pointer' }} title="Delete Object">
                        <ConfirmDelete
                            Title={"Delete Object " + obj.BusinessNetworkObjectName + "?"}
                            Text={"You are about to delete tracked object " + obj.BusinessNetworkObjectName + ". There are currently " + obj.ObjectCount + " imported objects of this type. This data will become unavailable. Are you sure you want to continue?"}
                            YesButtonText="Delete"
                            YesButtonAction={() => this.handleClickDelete(obj.BusinessNetworkObjectGUID)}
                        />
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
                                        There are no configured objects for this namespace Click on Add New button to create an object to track.
                                     </Alert>
                                </div>
                            </Form>
                        </div>
                        <div className="float-right">
                            <AddEditObject
                                ButtonText="Add New"
                                Data={{
                                    BusinessNetworkObjectGUID: null,
                                    BusinessNetworkNamespaceGUID: this.state.BusinessNetworkNamespaceGUID,
                                    BusinessNetworkObjectName: '',
                                    BusinessNetworkObjectClassName: '',
                                }}
                                OnFinishedAction={this.onFinishedAddEdit}
                                GUID={null}
                                BusinessNetworkGUID={this.props.BusinessNetworkGUID}
                            />
                        </div>
                    </div>
                )
                :
                (this.state.ObjectList == null ? (<Spinner />) : (
                    <div>
                        <Table striped responsive>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th hidden={this.state.ObjectSelected}>Class Name</th>
                                    <th>Count</th>
                                    <th width="30"></th>
                                    <th width="30"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>
                        </Table>
                        <div className="float-right">
                            <AddEditObject
                                ButtonText="Add New"
                                Data={{
                                    BusinessNetworkObjectGUID: null,
                                    BusinessNetworkNamespaceGUID: this.state.BusinessNetworkNamespaceGUID,
                                    BusinessNetworkObjectName: '',
                                    BusinessNetworkObjectClassName: '',
                                }}
                                OnFinishedAction={this.onFinishedAddEdit}
                                GUID={null}
                                BusinessNetworkGUID={this.props.BusinessNetworkGUID}
                            />
                        </div>
                    </div>)
                )
        );
    }
}