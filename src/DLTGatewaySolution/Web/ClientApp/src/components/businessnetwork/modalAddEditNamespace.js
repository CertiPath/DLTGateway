import React, { Component } from "react";
import { FilePlus, Edit } from 'react-feather';
import { toastr } from 'react-redux-toastr';
import apiClient from '../../utility/apiClient';
import Spinner from "../../components/spinner/spinner";
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Modal, ModalHeader, ModalBody, ModalFooter  } from "reactstrap";

class ModalAddEditNamespace extends Component {
    state = {
        modal: false,
        name: this.props.Name
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    handleButtonClick = () => {

        this.toggle();
        apiClient.post('BusinessNetworkNamespace/Save', {
            GUID: this.props.GUID,
            Name: this.state.name,
            BusinessNetworkGUID: this.props.BusinessNetworkGUID
        })
        .then(res => {
            //this.state.deleting = false;
            if (this.props.NewNamespace) {
                toastr.success('Success', 'Namespace successfully added.', { position: 'top-right' });
            }
            else {
                toastr.success('Success', 'Namespace successfully updated.', { position: 'top-right' });
            }
            this.props.OnFinishedAction();
        })
        .catch(function (error) {
            if (this.props.NewNamespace) {
                toastr.error('Error', 'There was an error trying to add business network namespace.', { position: 'top-right' });
            }
            else {
                toastr.error('Error', 'There was an error trying to update business network namespace.', { position: 'top-right' });
            }
        });
    }

    nameChange(event) {
        const inputName = event.target.value
        this.setState({
            name: inputName
        })
    }
    
    render() {
        return (
            <div>
                {
                    this.props.NewNamespace == true ? (
                    <Button onClick={this.toggle}>
                        Add New Namespace
                    </Button>
                    ) :
                        (
                            <Edit size={18} className="mr-2" onClick={this.toggle} />
                    )
                }
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className={this.props.className}
                    backdrop="static"
                >
                    <ModalHeader toggle={this.toggle}>
                        {
                            this.props.NewNamespace == true ? (
                                <span>Add New Namespace</span>
                            ) :
                            (
                                <span>Update Namespace</span>
                            )
                        }
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md="12">
                                <Form className="form-horizontal">
                                    <div className="form-body">
                                        <Row>
                                            <Col md="12">
                                                <FormGroup>
                                                    <Label for="txtName">Name</Label>
                                                    <Input type="text" id="txtName" defaultValue={this.state.name} onChange={this.nameChange.bind(this)} className="border-primary" name="name" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </div>
                                </Form>
                            </Col>
                        </Row>
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

export default ModalAddEditNamespace;