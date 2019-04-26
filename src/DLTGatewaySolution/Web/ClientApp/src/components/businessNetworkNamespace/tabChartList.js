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
import AddEditChart from "../../components/businessNetworkObject/modalAddEditChart";

export default class TrackedObjectChartList extends React.Component {
    constructor() {
        super();
        this.handleClickDelete = this.handleClickDelete.bind(this);
        this.handleEnable = this.handleEnable.bind(this);
        this.handleDisable = this.handleDisable.bind(this);
        this.onFinishedAddEdit = this.onFinishedAddEdit.bind(this);
    }
    
    handleEnable(chartGUID) {
        
        apiClient.post('BusinessNetworkObject/EnableChart', {
            "GUID": chartGUID
        })
            .then(res => {
                toastr.success('Success', 'Object chart successfully enabled.', { position: 'top-right' });
                this.props.ReloadListAction();
            })
            .catch(function (error) {
                toastr.error('Error', 'There was an error trying to enable chart.', { position: 'top-right' });
            });
    }

    handleDisable(chartGUID) {

        apiClient.post('BusinessNetworkObject/DisableChart', {
            "GUID": chartGUID
        })
            .then(res => {
                toastr.success('Success', 'Object chart successfully deleted.', { position: 'top-right' });
                this.props.ReloadListAction();
            })
            .catch(function (error) {
                toastr.error('Error', 'There was an error trying to disable chart.', { position: 'top-right' });
            });
    }

    handleClickDelete(chartGUID) {
        
        apiClient.post('BusinessNetworkObject/DeleteChart', {
            GUID: chartGUID
        })
            .then(res => {
                toastr.success('Success', 'Chart successfully deleted.', { position: 'top-right' });
                this.props.ReloadListAction();
            })
            .catch(function (error) {
                toastr.error('Error', 'There was an error trying to delete chart.', { position: 'top-right' });
            });
    }

    onFinishedAddEdit() {
        this.props.ReloadListAction();
    }
    
    render() {

        let rows = this.props.ChartList == null ? (<Spinner />) : this.props.ChartList.map(chart => {
            return (
                <tr>
                    <td>
                        <AddEditChart
                            ButtonText="Save"
                            Data={chart}

                            CategoryList={this.props.ChartCategoryList}
                            TypeList={this.props.ChartTypeList}
                            PropertyList={this.props.PropertyList}

                            OnFinishedAction={this.onFinishedAddEdit}
                            GUID={chart.GUID}
                            DisplayType="NAME"
                        />
                    </td>
                    <td>{chart.ChartCategoryName}</td>
                    <td>{chart.ChartTypeName}</td>
                    <td>
                        <ConfirmEnableDisable
                            Name={chart.Name}
                            YesButtonAction={() => chart.Disabled == false ? this.handleDisable(chart.GUID) : this.handleEnable(chart.GUID)}
                            Disabled={chart.Disabled}
                            DisabledText="Click on the enable button to make the chart enabled again."
                            EnabledText={"Disabling chart " + chart.Name + " will exclude it from the object details page. Are you sure you want to continue?"}
                    />
                    </td>
                    <td width="40px" title="Update chart settings">
                        <AddEditChart
                            ButtonText="Save"
                            Data={chart}
                            CategoryList={this.props.ChartCategoryList}
                            TypeList={this.props.ChartTypeList}
                            OnFinishedAction={this.onFinishedAddEdit}
                            GUID={chart.GUID}
                            DisplayType="ICON"
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
                                        <AddEditChart
                                            ButtonText="Add New Chart"
                                            Data={{
                                                Name: "",
                                                ChartSettings: "{}"
                                            }}
                                            CategoryList={this.props.ChartCategoryList}
                                            TypeList={this.props.ChartTypeList}
                                            PropertyList={this.props.PropertyList}
                                            BusinessNetworkObjectGUID={this.props.BusinessNetworkObjectGUID}

                                            OnFinishedAction={this.onFinishedAddEdit}
                                            GUID={null}
                                            DisplayType="BUTTON"
                                        />
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