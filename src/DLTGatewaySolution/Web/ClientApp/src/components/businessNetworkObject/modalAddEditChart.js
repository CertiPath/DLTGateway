﻿import React, { Component } from "react";
import { FilePlus, Edit } from 'react-feather';
import { toastr } from 'react-redux-toastr';
import apiClient from '../../utility/apiClient';
import Spinner from "../../components/spinner/spinner";
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { NavLink, Link } from "react-router-dom";

import StepZilla from "../wizard/StepZilla";
import Step1 from "./chartWizardSteps/Step1";
import Step2 from "./chartWizardSteps/Step2";
import Step3 from "./chartWizardSteps/Step3";
import Step4 from "./chartWizardSteps/Step4";
import StepSummary from "./chartWizardSteps/Step5";

import "../../assets/scss/components/wizard/wizard.scss"

class ModalAddEditChart extends Component {

    constructor(props) {

        super();

        this.ChartNameChangedAction = this.ChartNameChangedAction.bind(this);
        this.ChartDescriptionChangedAction = this.ChartDescriptionChangedAction.bind(this);
        this.ChartTypeChangedAction = this.ChartTypeChangedAction.bind(this);
        this.ChartCategoryChangedAction = this.ChartCategoryChangedAction.bind(this);
        this.onSeriesUpdated = this.onSeriesUpdated.bind(this);
        this.onUpdateStep4Action = this.onUpdateStep4Action.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        
        this.state = {
            modal: false,
            CurrentStep: 0,

            ChartGUID: props.GUID,
            ChartName: props.Data.Name,
            ChartDescription: props.Data.Description,
            ChartTypeGUID: props.Data.ChartTypeGUID,
            ChartTypeName: props.Data.ChartTypeName,
            ChartCategoryGUID: props.Data.ChartCategoryGUID,
            ChartCategoryName: props.Data.ChartCategoryName,
            ChartCategoryCode: props.Data.ChartCategoryCode,
            ChartSeries: JSON.parse(props.Data.ChartSettings).Series != undefined ? JSON.parse(props.Data.ChartSettings).Series : [],
            ChartDataValue: JSON.parse(props.Data.ChartSettings).XAxes != undefined ? JSON.parse(props.Data.ChartSettings).XAxes.Value : '',
            ChartDataType: JSON.parse(props.Data.ChartSettings).XAxes != undefined ? JSON.parse(props.Data.ChartSettings).XAxes.Type : '',
            ChartShowGridlines: JSON.parse(props.Data.ChartSettings).ShowGridlines != undefined ? JSON.parse(props.Data.ChartSettings).ShowGridlines : false,

            Data: props.Data
        };
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }
    
    componentDidMount() {}

    onUpdateStep4Action(value, type, showGridlines) {
        this.setState({
            ChartDataValue: value,
            ChartDataType: type,
            ChartShowGridlines: showGridlines
        });
    }

    ChartNameChangedAction(name) {
        this.setState({
            ChartName: name
        });
    }
    ChartDescriptionChangedAction(desc) {
        this.setState({
            ChartDescription: desc
        });
    }
    ChartCategoryChangedAction(guid, name, code) {
        this.setState({
            ChartCategoryGUID: guid,
            ChartCategoryName: name,
            ChartCategoryCode: code
        });
    }
    ChartTypeChangedAction(guid, name) {
        this.setState({
            ChartTypeGUID: guid,
            ChartTypeName: name
        });
    }
    onSeriesUpdated(series) {
        this.setState({
            ChartSeries: series
        });
    }
    handleSaveClick() {
        this.toggle();
        apiClient.post('BusinessNetworkObject/SaveChart', {
            GUID: this.state.ChartGUID,
            BusinessNetworkObjectGUID: this.props.BusinessNetworkObjectGUID,
            Name: this.state.ChartName,
            Description: this.state.ChartDescription,
            ChartTypeGUID: this.state.ChartTypeGUID,
            ChartSettingsObject: {
                ShowGridlines: this.state.ChartShowGridlines,
                XAxes: {
                    Title: "",
                    Category: "TIMELINE",
                    Type: this.state.ChartDataType,
                    Value: this.state.ChartDataValue
                },
                Series: this.state.ChartSeries
            }
        })
            .then(res => {
                toastr.success('Success', 'Object chart successfully saved.', { position: 'top-right' });
                this.props.OnFinishedAction();
            })
            .catch(function (error) {
                toastr.error('Error', 'There was an error trying to save chart.', { position: 'top-right' });
            });
    }
    
    render() {

        let steps = [
            {
                name: "Chart Type",
                component: (
                    <div style={{ height: '400px' }}>
                        <Step1
                            onRef={ref => (this.step1 = ref)}

                            ChartGUID={this.props.GUID}
                            ChartCategoryGUID={this.state.ChartCategoryGUID}
                            ChartTypeGUID={this.state.ChartTypeGUID}

                            CategoryList={this.props.CategoryList}
                            TypeList={this.props.TypeList}

                            ChartCategoryChangedAction={this.ChartCategoryChangedAction}
                            ChartTypeChangedAction={this.ChartTypeChangedAction}
                            
                        />
                    </div>
                ),
                visible: true,
                isValidated: () => this.step1Validate()

            },
            {
                name: "Name and Description",
                component: (
                    <div style={{ height: '400px' }}>
                        <Step2
                            onRef={ref => (this.step2 = ref)}

                            ChartName={this.state.ChartName}
                            ChartDescription={this.state.ChartDescription}
                            ChartNameChangedAction={this.ChartNameChangedAction}
                            ChartDescriptionChangedAction={this.ChartDescriptionChangedAction}
                        />
                    </div>
                ),
                visible: true,
                isValidated: false
            },
            {
                name: "Data",
                component: (
                    <div style={{ height: '400px' }}>
                        <Step3
                            onRef={ref => (this.step3 = ref)}

                            ChartSeries={this.state.ChartSeries}
                            PropertyList={this.props.PropertyList}
                            OnSeriesUpdated={this.onSeriesUpdated}
                        />
                    </div>
                ),
                visible: true
            },
            {
                name: "Settings",
                component: (
                    <div style={{ height: '400px' }}>
                        <Step4
                            onRef={ref => (this.step4 = ref)}
                            DataValue={this.state.ChartDataValue}
                            DataType={this.state.ChartDataType}
                            ShowGridlines={this.state.ChartShowGridlines}
                            OnUpdateStep4Action={this.onUpdateStep4Action}
                        />
                    </div>
                ),
                visible: this.state.ChartCategoryCode == 'TIMELINE'
            },
            {
                name: "Summary",
                component: (
                    <div style={{ height: '400px' }}>
                        <StepSummary
                            CategoryName={this.state.ChartCategoryName}
                            CategoryCode={this.state.ChartCategoryCode}
                            TypeName={this.state.ChartTypeName}
                            ChartName={this.state.ChartName}
                            ChartDescription={this.state.ChartDescription}
                            ChartSeries={this.state.ChartSeries}
                            AmountOfData={this.state.ChartDataValue + ' ' + this.state.ChartDataType}
                        />
                    </div>
                ),
                visible: true
            }
        ];

        let stepsFinal = [];
        steps.map((step, index) => {
            if (step.visible) {
                stepsFinal.push(step);
            }
        });

        return (
            <div>
                {
                    this.props.DisplayType == "NAME" ? (
                        <Link to="#" onClick={this.toggle} style={{ cursor: 'pointer' }}>{this.props.Data.Name}</Link>
                    ) : this.props.DisplayType == "ICON" ?
                        (
                            <Edit size={18} className="mr-2" onClick={this.toggle} style={{ cursor: 'pointer' }} />
                        ) : (
                            <Button onClick={this.toggle}>
                                {this.props.ButtonText}
                            </Button>
                        )
                }
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className="modal-dialog modal-lg"
                    backdrop="static"
                >
                    <ModalHeader toggle={this.toggle}>
                        {
                            this.props.GUID == null ? (
                                <span>Add New Chart</span>
                            ) :
                            (
                                <span>{this.state.ChartName}</span>
                            )
                        }
                    </ModalHeader>
                    <ModalBody>
                        <StepZilla
                            steps={stepsFinal}
                            preventEnterSubmission={true}
                            nextTextOnFinalActionStep={"Save"}
                            hocValidationAppliedTo={[0, 1, 2, 3]}
                            startAtStep={0}
                            onStepChange={step => this.setState({ CurrentStep: step })}
                            StepRefs={[this.step1, this.step2, this.step3, this.step4]}
                    />
                    </ModalBody>
                    <ModalFooter>
                        {
                            (this.state.CurrentStep == 4 && this.state.ChartCategoryCode == 'TIMELINE') ||
                                (this.state.CurrentStep == 3 && this.state.ChartCategoryCode != 'TIMELINE') ? 
                            ( 
                                    <Button color="primary" onClick={() => {
                                        this.handleSaveClick();
                                    }}>
                                        {this.props.ButtonText}
                                    </Button>
                            ) : ('')
                        }
                        <Button color="secondary" onClick={this.toggle}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
export default ModalAddEditChart;