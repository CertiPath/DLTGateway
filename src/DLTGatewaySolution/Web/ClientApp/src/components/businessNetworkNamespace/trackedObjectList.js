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
import AddObject from "../../components/businessNetworkObject/modalAddObject";

export default class TrackedObjectList extends React.Component {
    constructor(props) {
        
        super();

        // Bind the this context to the handler function
        this.handleClickSelected = this.handleClickSelected.bind(this);
        
        this.state = {
            ObjectList: null,
            BusinessNetworkNamespaceGUID: props.BusinessNetworkNamespaceGUID
        };
    }

    componentDidMount() {
        this.loadData();
    }
    
    loadData(networkGUID) {
        apiClient.get('BusinessNetworkObject/GetAllByNamespace?BusinessNetworkNamespaceGUID=' + this.state.BusinessNetworkNamespaceGUID, {})
            .then(res => {
                this.setState({
                    ObjectList: res.data
                });
            });
    }

    handleClickSelected = (objGUID, objName) => {
        this.props.OnObjectSelectedClick(objGUID, objName);
    }
    
    render() {
        let rows = this.state.ObjectList == null ? '<div></div>' : this.state.ObjectList.map(obj => {
            return (
                <tr>
                    <td><Link to="#" onClick={() => this.handleClickSelected(obj.BusinessNetworkObjectGUID, obj.BusinessNetworkObjectName)}>{obj.BusinessNetworkObjectName}</Link></td>
                    <td>{obj.ObjectCount}</td>
                    <td style={{ paddingLeft: 0, paddingRight: 0, cursor: 'pointer' }} title="Delete Namespace">
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
                            <AddObject
                                ButtonText="Add New"
                                Name=""
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
                                    <th>Count</th>
                                    <th width="40"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>
                        </Table>
                        <div className="float-right">
                            <AddObject
                                ButtonText="Add New"
                                Name=""
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