import React, { Component } from "react";
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
import Step5 from "./chartWizardSteps/Step5";

import "../../assets/scss/components/wizard/wizard.scss"

class ModalAddEditChart extends Component {

    constructor(props) {

        super();

        this.ChartNameChangedAction = this.ChartNameChangedAction.bind(this);
        
        this.state = {
            modal: false,
            ChartGUID: props.GUID,
            ChartName: props.Data.Name,
            Data: props.Data
        };
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    /*****/
     sampleStore = {
      email: "",
      gender: "",
      savedToCloud: false
   };

   componentDidMount() {}

   componentWillUnmount() {}

   getStore() {
      return this.sampleStore;
   }

    updateStore(update) {
        alert('what');
        debugger;
      this.sampleStore = {
         ...this.sampleStore,
         ...update
      };
   }
   /****/

    handleButtonClick = () => {
        alert('hola');
        /*
        this.toggle();
        apiClient.post('BusinessNetworkObject/Save', this.state.Data)
            .then(res => {
                if (this.state.Data.GUID == null) {
                    toastr.success('Success', 'Object successfully added.', { position: 'top-right' });
                }
                else {
                    toastr.success('Success', 'Object successfully updated.', { position: 'top-right' });
                }
                this.props.OnFinishedAction();
            })
            .catch(function (error) {
                toastr.error('Error', 'There was an error trying to add business network object.', { position: 'top-right' });
            });
        */
    }

    /*
    nameChange(event) {
        const inputName = event.target.value
        let data = this.state.Data;
        data.BusinessNetworkObjectName = inputName;
        this.setState({
            Data: data
        })
    }

    classNameChange(event) {
        const inputName = event.target.value
        let data = this.state.Data;
        data.BusinessNetworkObjectClassName = inputName;
        this.setState({
            Data: data
        })
    }
    */

    ChartNameChangedAction(name) {
        this.setState({
            ChartName: name
        });
    }

    render() {

        const steps = [
            {
                name: "Chart Type",
                component: (
                    <div style={{ height: '400px' }}>
                        <Step1
                            ChartGUID={this.props.GUID}
                            ChartCategoryGUID={this.props.Data.ChartCategoryGUID}
                            ChartTypeGUID={this.props.Data.ChartCategoryGUID}
                            CategoryList={this.props.CategoryList}
                            TypeList={this.props.TypeList}

                            getStore={() => this.getStore()}
                            updateStore={u => {
                                this.updateStore(u);
                            }}
                        />
                    </div>
                )
            },
            {
                name: "Name and Description",
                component: (
                    <div style={{ height: '400px' }}>
                        <Step2
                            ChartName={this.props.Data.Name}
                            ChartDescription={this.props.Data.Description}
                            ChartNameChangedAction={this.ChartNameChangedAction}

                            getStore={() => this.getStore()}
                            updateStore={u => {
                                this.updateStore(u);
                            }}
                        />
                    </div>
                )
            },
            {
                name: "Data",
                component: (
                    <div style={{ height: '400px' }}>
                        <Step3
                            ChartSettings={this.props.Data.ChartSettings}

                            getStore={() => this.getStore()}
                            updateStore={u => {
                                this.updateStore(u);
                            }}
                        />
                    </div>
                )
            },
            {
                name: "Settings",
                component: (
                    <div style={{ height: '400px' }}>Step 4</div>
                )
            },
            {
                name: "Summary",
                component: (
                    <div style={{ height: '400px' }}>
                        <Step5
                            CategoryName="dsadsad"
                            TypeName="Dsadsa"
                            ChartName="my chart todo"
                            ChartSeries="todo, todo"

                            getStore={() => this.getStore()}
                            updateStore={u => {
                                this.updateStore(u);
                            }}
                        />
                    </div>
                )
            }
        ];

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
                            steps={steps}
                            preventEnterSubmission={true}
                            nextTextOnFinalActionStep={"Save"}
                            //hocValidationAppliedTo={[3]}
                            startAtStep={window.sessionStorage.getItem("step") ? parseFloat(window.sessionStorage.getItem("step")) : 0}
                            onStepChange={step => window.sessionStorage.setItem("step", step)}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => {
                            this.handleButtonClick();
                        }}>
                            {this.props.ButtonText}
                        </Button>{" "}
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