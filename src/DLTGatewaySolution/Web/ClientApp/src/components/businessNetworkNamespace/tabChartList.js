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
import ConfirmEnableDisable from "../../components/businessnetwork/modalConfirmEnableDisable";

export default class TrackedObjectChartList extends React.Component {
    constructor() {
        super();
        // Bind the this context to the handler function
        this.handleClickDelete = this.handleClickDelete.bind(this);
        this.handleEnable = this.handleEnable.bind(this);
        //this.onFinishedAddEdit = this.onFinishedAddEdit.bind(this);
    }

    /*
    onFinishedAddEdit() {
        this.props.onFinishedAddEdit();
    }
    */

    handleEnable(networkGUID) {
        /*
        apiClient.post('BusinessNetwork/Enable', {
            "GUID": networkGUID
        })
            .then(res => {
                toastr.success('Success', 'Network successfully enabled.', { position: 'top-right' });
                // should just switch the button, but cannot figure out how to do it at the moment
                // so reloading the entire list
                this.loadData();
            })
            .catch(function (error) {
                toastr.error('Error', 'There was an error trying to enable network.', { position: 'top-right' });
            });
            */
        alert('dsa')
    }

    handleClickDelete(objGUID) {
        /*
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
        */
        alert('hola')
    }
    
    render() {

        let rows = this.props.ChartList == null ? (<Spinner />) : this.props.ChartList.map(chart => {
            return (
                <tr>
                    <td>{chart.Name}</td>
                    <td>{chart.ChartCategoryName}</td>
                    <td>{chart.ChartTypeName}</td>
                    <td>
                        <ConfirmEnableDisable
                            Name={chart.Name}
                            YesButtonAction={() => chart.Disabled == false ? this.handleDisable(chart.GUID) : this.handleEnable(chart.GUID)}
                            Disabled={chart.Disabled}
                        />
                    </td>
                    <td width="40px">
                        <ConfirmDelete
                            Title={"Delete " + chart.Name + "?"}
                            Text={"You are about to delete configured chart " + chart.Name + ". Once you delete it all the configuration will be gone. Do you want to continue?"}
                            YesButtonText="Delete"
                            YesButtonAction={() => this.handleClickDelete(chart.GUID)}
                        />
                    </td>
                </tr>
            )
        });

        return (
            <div>
                <Row>
                    <Col sm="12">
                        <div>
                            <Form>
                                {rows.length != 0 ? (
                                    <Table striped responsive>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Category</th>
                                                <th>Type</th>
                                                <th>Enabled</th>
                                                <th width="40px"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows}
                                        </tbody>
                                    </Table>
                                ) :
                                    (
                                        <Alert color="dark">
                                            There are currently no defined object properties. Click on the add new object property button to enter values.
                                    </Alert>
                                    )}
                                <div className="form-actions">
                                    <div className="float-right">
                                        Add New CHart
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