import "react-table/react-table.css";

import React from "react";
import { toastr } from 'react-redux-toastr';
import { FileText, Edit, Trash2, CheckSquare } from 'react-feather';
import Spinner from "../../components/spinner/spinner";
import { Button, CardTitle, Row, Col, Form, CardBody, Table, FormGroup, CustomInput, Alert } from "reactstrap";
import classnames from "classnames";

import apiClient from "../../utility/apiClient";
import ConfirmDelete from "../../components/common/modal/ConfirmDialog";
import AddEditObjectProperty from "../../components/businessNetworkNamespace/modalAddEditObjectProperty";

export default class TrackedObjectList extends React.Component {
    constructor(props) {
        super();
        // Bind the this context to the handler function
        this.handleClickDelete = this.handleClickDelete.bind(this);
        this.onFinishedAddEdit = this.onFinishedAddEdit.bind(this);
        

    }

    onFinishedAddEdit() {
        this.props.onFinishedAddEdit();
    }

    handleClickDelete(objGUID) {
        apiClient.post('BusinessNetworkObject/DeleteProperty', {
            GUID: objGUID
        })
            .then(res => {
                toastr.success('Success', 'Object property successfully deleted.', { position: 'top-right' });
                this.onFinishedAddEdit();
            })
            .catch(function (error) {
                toastr.error('Error', 'There was an error trying to delete object property..', { position: 'top-right' });
            });
    }

    render() {
        
        let rows = this.props.ObjectDetails == null ? '<div></div>' : this.props.ObjectDetails.PropertyList.map(dataField => {
            return (
                <tr>
                    <td>{dataField.Name}</td>
                    <td>{dataField.PropertyTypeName}</td>
                    <td>
                        <FormGroup check className="px-0">
                            <CustomInput type="checkbox" id={"cbxEnabled_" + dataField.GUID} checked={!dataField.Disabled} disabled />
                        </FormGroup>
                    </td>
                    <td>
                        <FormGroup check className="px-0">
                            <CustomInput type="checkbox" id={"cbxVisible_" + dataField.GUID} checked={dataField.Visible} disabled />
                        </FormGroup>
                    </td>
                    <td width="40px">
                        {
                            this.props.ReadOnly == true ? '' :
                                (
                                    <AddEditObjectProperty
                                        ButtonText="Save"
                                        BusinessNetworkObjectGUID={this.props.ObjectDetails.GUID}
                                        Data={dataField}
                                        OnFinishedAction={this.onFinishedAddEdit}
                                        GUID={dataField.GUID}
                                    />
                                )
                        }
                    </td>
                    <td width="40px">
                        {
                            this.props.ReadOnly == true ? '' :
                                (
                                    <ConfirmDelete
                                        Title={"Delete Property " + dataField.Name + "?"}
                                        Text={"You are about to delete object property " + dataField.Name + ". This field will not be tracked and visible and all associated charts and reports will be affected. Do you want to continue?"}
                                        YesButtonText="Delete"
                                        YesButtonAction={() => this.handleClickDelete(dataField.GUID)}
                                    />
                                )
                        }
                    </td>
                </tr>
            )
        });

        return (
            <div>
                <Row>
                    <Col sm="12">
                        <p>Disabled properties will not be processed at all. Non-visible propreties will be processed, but their values will not be visible in the object detailed view and you will not be able to create charts and reports against them.</p>
                    </Col>
                </Row>
                <Row>
                    <Col sm="12">
                        <div>
                            <Form>
                                {rows.length != 0 ? (
                                    <Table striped responsive>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Enabled</th>
                                                <th>Visible</th>
                                                <th></th>
                                                <th width="40px"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows}
                                        </tbody>
                                    </Table>    
                                ):
                                (
                                    <Alert color="dark">
                                        There are currently no defined object properties. Click on the add new object property button to enter values.
                                    </Alert>
                                )}
                                <div className="form-actions">
                                    <div className="float-right">
                                        {
                                            this.props.ReadOnly == true ? '' :
                                                (
                                                    <AddEditObjectProperty
                                                        ButtonText="Add New"
                                                        Data={{
                                                            GUID: null,
                                                            BusinessNetworkObjectGUID: this.props.ObjectDetails.GUID,
                                                            Name: '',
                                                            Visible: false,
                                                            Disabled: true,
                                                            PropertyTypeCode: '',
                                                            PropertyTypeName: '',
                                                        }}
                                                        OnFinishedAction={this.onFinishedAddEdit}
                                                        GUID={null}
                                                    />
                                                )
                                        }
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}