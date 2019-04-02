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
        apiClient.post('BusinessNetworkObject/Save', {
            BusinessNetworkObjectGUID: this.props.GUID,
            BusinessNetworkObjectName: this.state.name,
            BusinessNetworkClassName: "",
            BusinessNetworkNamespaceGUID: this.props.BusinessNetworkNamespaceGUID
        })
        .then(res => {
            toastr.success('Success', 'Object successfully added.', { position: 'top-right' });
            this.props.OnFinishedAction();
        })
        .catch(function (error) {
            toastr.error('Error', 'There was an error trying to add business network object.', { position: 'top-right' });
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
                    <Button color="primary" onClick={this.toggle}>
                        <FilePlus size={16} color="#FFF" /> Add New Namespace
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
                                                    <Label for="txtDisplayName">Display Name</Label>
                                                    <Input type="text" id="txtDisplayName" className="border-primary" name="txtDisplayName" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <FormGroup>
                                                    <Label for="txtClassName">Class Name</Label>
                                                    <Input type="text" id="txtClassName"  className="border-primary" name="txtClassName" />
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