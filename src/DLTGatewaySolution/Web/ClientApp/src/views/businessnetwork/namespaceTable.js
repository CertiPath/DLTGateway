import "react-table/react-table.css";

import React from "react";
import { toastr } from 'react-redux-toastr';
import { FileText, Edit, Trash2, CheckSquare } from 'react-feather';
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Table } from "reactstrap";
import Spinner from "../../components/spinner/spinner";
import { Alert } from "reactstrap";
import { NavLink } from "react-router-dom";

import apiClient from "../../utility/apiClient";
import ConfirmDelete from "../../components/common/modal/ConfirmDialog";
import AddEditNamespace from "../../components/businessnetwork/modalAddEditNamespace"

export default class Example extends React.Component {
    constructor(props) {
        
        super();

        // Bind the this context to the handler function
        this.handleClickDelete = this.handleClickDelete.bind(this);
        this.onFinishedAddEdit = this.onFinishedAddEdit.bind(this);
        
        this.state = {
            NamespaceList: null,
            BusinessNetworkGUID: props.BusinessNetworkGUID
        };
    }

    componentDidMount() {
        this.loadData();
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.BusinessNetworkGUID !== this.props.BusinessNetworkGUID) {
            if (nextProps.BusinessNetworkGUID.toUpperCase() === 'NEW') {
                this.setState({
                    NamespaceList: null,
                    BusinessNetworkGUID: 'NEW'
                });
            }
            else {
                this.state.BusinessNetworkGUID = nextProps.BusinessNetworkGUID;
                this.loadData();
            }
        }
    }
    
    loadData(networkGUID) {
        apiClient.get('BusinessNetworkNamespace/GetAll?BusinessNetworkGUID=' + this.state.BusinessNetworkGUID, {})
            .then(res => {
                this.setState({
                    NamespaceList: res.data
                });
            });
    }

    onFinishedAddEdit() {
        this.loadData();
    }

    handleClickDelete = (namespaceGUID) => {
        
        apiClient.post('BusinessNetworkNamespace/Delete', {
            "GUID": namespaceGUID
        })
        .then(res => {
            toastr.success('Success', 'Namespace successfully deleted.', { position: 'top-right' });
            this.loadData();
        })
        .catch(function (error) {
            this.state.deleting = false;
            toastr.error('Error', 'There was an error trying to delete namespace.', { position: 'top-right' });
        });
    }

    render() {
        let rows = this.state.NamespaceList == null ? '<div></div>' : this.state.NamespaceList.map(namespace => {
            return (
                <tr>
                    <td><NavLink to={"/BusinessNetwork/Namespace/" + namespace.GUID}>{namespace.Name}</NavLink></td>
                    <td>{namespace.ObjectCount}</td>
                    <td style={{ paddingLeft: 0, paddingRight: 0, cursor: 'pointer' }} title="Edit Namespace">
                        <AddEditNamespace
                            NewNamespace={false}
                            ButtonText="Save"
                            Name={namespace.Name}
                            OnFinishedAction={this.onFinishedAddEdit}
                            GUID={namespace.GUID}
                            BusinessNetworkGUID={namespace.BusinessNetworkGUID}
                        />
                    </td>
                    <td style={{ paddingLeft: 0, paddingRight: 0, cursor: 'pointer' }} title="Delete Namespace">
                        <ConfirmDelete
                            Title={"Delete Namespace " + namespace.Name + "?"}
                            Text={"You are about to delete namespace " + namespace.Name + ". All associated tracked objects will be deleted with it. Are you sure you want to continue?"}
                            YesButtonText="Delete"
                            YesButtonAction={() => this.handleClickDelete(namespace.GUID)}
                        />
                    </td>
                </tr>
            )
        });

        return (

            this.state.BusinessNetworkGUID.toUpperCase() === 'NEW' ? 
                (
                    <Card>
                        <CardBody>
                            <div className="px-3">
                                <Form className="form-horizontal">
                                    <div className="form-body">
                                        <h4 className="form-section"><FileText size={20} color="#212529" /> Namespaces</h4>
                                        <Alert color="dark">
                                            Create business network record first in order to add namespaces and objects to track.
                                        </Alert>
                                    </div>
                                </Form>
                            </div>
                        </CardBody>
                    </Card>
                ) :

                (
                    rows.length === 0 ?
                        (
                            <Card>
                                <CardBody>
                                    <div className="px-3">
                                        <Form className="form-horizontal">
                                            <div className="form-body">
                                                <h4 className="form-section"><FileText size={20} color="#212529" /> Namespaces</h4>
                                                <Alert color="dark">
                                                    There are no configured namespaces for this business network. Click on Add New button to create a namespace record.
                                                </Alert>
                                            </div>
                                        </Form>
                                    </div>
                                    <div className="form-actions bottom clearfix">
                                        <div className="float-right">
                                            <AddEditNamespace
                                                NewNamespace={true}
                                                ButtonText="Add New"
                                                Name=""
                                                OnFinishedAction={this.onFinishedAddEdit}
                                                GUID={null}
                                                BusinessNetworkGUID={this.props.BusinessNetworkGUID}
                                            />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        )
                        :
                        (this.state.NamespaceList == null ? (<Spinner />) : (
                        <Card>
                            <CardBody>
                                <div className="px-3">
                                    <Form className="form-horizontal">
                                            <div className="form-body">
                                            {
                                                    this.props.ShowHeader == null || this.props.ShowHeader == false ? ('') :
                                                        (<h4 className="form-section"><FileText size={20} color="#212529" /> Namespaces</h4>)
                                            }

                                            <Table striped responsive>
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Objects Tracked</th>
                                                        <th width="18"></th>
                                                        <th width="40"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {rows}
                                                </tbody>
                                            </Table>

                                            <div className="form-actions bottom clearfix">
                                                <div className="float-right">
                                                    <AddEditNamespace
                                                        NewNamespace={true}
                                                        ButtonText="Add New"
                                                        Name=""
                                                        OnFinishedAction={this.onFinishedAddEdit}
                                                        GUID={null}
                                                        BusinessNetworkGUID={this.props.BusinessNetworkGUID}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            </CardBody>
                        </Card>)
                )
                
            ) 
        );
    }
}