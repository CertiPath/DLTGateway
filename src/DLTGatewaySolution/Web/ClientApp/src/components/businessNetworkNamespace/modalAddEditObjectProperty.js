import React, { Component } from "react";
import { FilePlus, Edit } from 'react-feather';
import { toastr } from 'react-redux-toastr';
import apiClient from '../../utility/apiClient';
import Spinner from "../../components/spinner/spinner";
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Modal, ModalHeader, ModalBody, ModalFooter, CustomInput } from "reactstrap";

class ModalAddEditObjectProperty extends Component {
    state = {
        modal: false,
        Data: this.props.Data
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.Data.Name == '') {
            this.setState({
                Data: nextProps.Data
            });
        }
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }
   
    handleButtonClick = () => {
        
        this.toggle();
        apiClient.post('BusinessNetworkObject/SaveProperty', this.state.Data)
        .then(res => {
            if (this.state.Data.GUID == null) {
                toastr.success('Success', 'Object property successfully added.', { position: 'top-right' });
            }
            else {
                toastr.success('Success', 'Object property successfully updated.', { position: 'top-right' });
            }
            this.props.OnFinishedAction();
        })
        .catch(function (error) {
            toastr.error('Error', 'There was an error trying to save object property.', { position: 'top-right' });
        });
    }

    nameChange(event) {
        const inputName = event.target.value
        let data = this.state.Data;
        data.Name = inputName;
        this.setState({
            Data: data
        })
    }

    typeChange(event) {
        const inputName = event.target.value
        let data = this.state.Data;
        data.PropertyTypeCode = inputName;
        this.setState({
            Data: data
        })
    }

    enableChange(event) {
        let data = this.state.Data;
        data.Disabled = !event.target.checked;
        this.setState({
            Data: data
        })
    }

    visibleChange(event) {
        let data = this.state.Data;
        data.Visible = event.target.checked;
        this.setState({
            Data: data
        })
    }

    render() {
        return (
            <div>
                {
                    this.state.Data.GUID == null ? (
                    <Button onClick={this.toggle}>
                        Add New Object Property
                    </Button>
                    ) :
                    (
                        <Edit size={18} className="mr-2" onClick={this.toggle} style={{ cursor: 'pointer' }} />
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
                            this.state.Data.GUID == true ? (
                                <span>Add New Object Property</span>
                            ) :
                            (
                                <span>Update Object Property</span>
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
                                                    <Label for="name">Name</Label>
                                                    <Input type="text" id="name" defaultValue={this.state.Data.Name} onChange={this.nameChange.bind(this)} className="border-primary" name="name" />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="propertyType">Property Type</Label>
                                                    <Input type="select" id="propertyType" name="propertyType" value={this.state.Data.PropertyTypeCode} onChange={this.typeChange.bind(this)} >
                                                        <option value="">Select Type</option>
                                                        <option value="NUMERIC">Numeric</option>
                                                        <option value="TEXT">Text</option>
                                                        <option value="BOOL">Boolean</option>
                                                        <option value="COMPLEX">Complex Object</option>
                                                    </Input>
                                                </FormGroup>
                                                <FormGroup check className="px-0">
                                                    <CustomInput type="checkbox" id="isEnabled" label="Enabled" defaultChecked={!this.state.Data.Disabled} onChange={this.enableChange.bind(this)} />
                                                </FormGroup>
                                                <FormGroup check className="px-0">
                                                    <CustomInput type="checkbox" id="isVisible" label="Visible" defaultChecked={this.state.Data.Visible} onChange={this.visibleChange.bind(this)} />
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

export default ModalAddEditObjectProperty;