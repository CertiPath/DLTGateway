import React, { Component } from "react";
import { FilePlus, Edit } from 'react-feather';
import { toastr } from 'react-redux-toastr';
import apiClient from '../../utility/apiClient';
import Spinner from "../../components/spinner/spinner";
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import StepZilla from "../wizard/StepZilla";

import "../../assets/scss/components/wizard/wizard.scss"

class ModalAddEditChart extends Component {


    state = {
        modal: false,
        ChartGUID: this.props.GUID,
        Data: this.props.Data
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

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

    render() {

        const steps = [
            {
                name: "Chart Type",
                component: (
                    <div style={{ height: '400px' }}>Step 1</div>
                )
            },
            {
                name: "Name and Description",
                component: (
                    <div style={{ height: '400px' }}>Step 2</div>
                )
            },
            {
                name: "Settings",
                component: (
                    <div style={{ height: '400px' }}>Step 3</div>
                )
            },
            {
                name: "Data",
                component: (
                    <div style={{ height: '400px' }}>Step 4</div>
                )
            }
        ];

        return (
            <div>
                {
                    this.props.GUID == null ? (
                        <Button onClick={this.toggle}>
                            {this.props.ButtonText}
                        </Button>
                    ) :
                        (
                            <Edit size={18} className="mr-2" onClick={this.toggle} style={{ cursor: 'pointer' }} />
                        )
                }
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className="modal-dialog modal-xl"
                    backdrop="static"
                >
                    <ModalHeader toggle={this.toggle}>
                        <span>Add New Chart</span>
                    </ModalHeader>
                    <ModalBody>
                        <StepZilla
                            steps={steps}
                            preventEnterSubmission={true}
                            nextTextOnFinalActionStep={"Save"}
                            hocValidationAppliedTo={[3]}
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