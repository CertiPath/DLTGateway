import React, { Component } from "react";
import { FilePlus, Edit } from 'react-feather';
import { toastr } from 'react-redux-toastr';
import apiClient from '../../utility/apiClient';
import Spinner from "../../components/spinner/spinner";
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Modal, ModalHeader, ModalBody, ModalFooter  } from "reactstrap";

class ModalAddEditObject extends Component {

    
    state = {
        modal: false,
        Data: this.props.Data,
        ReadOnly: this.props.ReadOnly
    };
    
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    handleButtonClick = () => {

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
    }

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
    
    render() {
        return (
            <div>
                
                {
                    this.state.Data.BusinessNetworkObjectGUID == null && this.state.ReadOnly == false ? (
                        <Button onClick={this.toggle}>
                            Add New Tracked Object
                        </Button>
                    ) : this.state.ReadOnly ? ('') :
                            (
                                <Edit size={18} {...(this.state.ReadOnly && { disabled: true })} className="mr-2" onClick={this.toggle} style={{ cursor: 'pointer' }} />
                        )
                }
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className={this.props.className}
                    backdrop="static"
                >
                    <ModalHeader toggle={this.toggle}>
                        <span>Add New Object</span>
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md="12">
                                <Form className="form-horizontal">
                                    <div className="form-body">
                                        <Row>
                                            <Col md="12">
                                                <FormGroup>
                                                    <Label for="Name">Display Name</Label>
                                                    <Input type="text" {...(this.state.ReadOnly && { disabled: true })} id="Name" className="border-primary" defaultValue={this.state.Data.BusinessNetworkObjectName} onChange={this.nameChange.bind(this)} />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <FormGroup>
                                                    <Label for="ClassName">Class Name</Label>
                                                    <Input type="text" {...(this.state.ReadOnly && { disabled: true })} id="ClassName" className="border-primary" defaultValue={this.state.Data.BusinessNetworkObjectClassName} onChange={this.classNameChange.bind(this)} />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>

                        {
                            this.state.ReadOnly == true ? '' :
                                (
                                    <Button color="primary" onClick={() => {
                                        this.handleButtonClick();
                                    }}>
                                        {this.props.ButtonText}
                                    </Button>
                                )
                        }
                        {" "}
                        <Button color="secondary" onClick={this.toggle}>
                            Cancel
                  </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default ModalAddEditObject;