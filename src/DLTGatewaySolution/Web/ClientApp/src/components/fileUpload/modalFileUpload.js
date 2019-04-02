import React, { Component } from "react";
import { Upload } from 'react-feather';
import { toastr } from 'react-redux-toastr';
import apiClient from '../../utility/apiClient';
import Spinner from "../../components/spinner/spinner";
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Modal, ModalHeader, ModalBody, ModalFooter  } from "reactstrap";

import "../../assets/css/fileUpload.css";

class ModalFileUpload extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            name: props.Name,

            FileOriginalName: props.Name,
            FileGivenName: props.Name,
            FileType: '',
            FileSize: ''
        };
    }
    
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    handleSaveFileClick = () => {
        
        this.toggle();
        let data = new FormData();
        data.append('file', this.state.FileData);
        data.append('name', this.state.FileGivenName);
        data.append('BusinessNetworkGUID', this.props.BusinessNetworkGUID);

        apiClient.post('BusinessNetwork/SaveConnectionFile', data)
        .then(res => {
            toastr.success('Success', 'Connection file successfully uploaded.', { position: 'top-right' });
            this.props.HandleUploadFinished();
        })
        .catch(function (error) {
            toastr.error('Error', 'There was an error trying to upload a connection file.', { position: 'top-right' });
        });
    }

    nameChange(event) {
        const inputName = event.target.value
        this.setState({
            FileGivenName: inputName
        })
    }

    UploadFileSelected = (files) => {
        this.setState({
            FileGivenName: files[0].name,
            FileOriginalName: files[0].name,
            FileType: files[0].type,
            FileSize: files[0].size,
            FileData: files[0]
        })
        this.toggle();
    }
    
    render() {
        return (
            <div>
                <div class="upload-btn-wrapper" title="Upload a file">
                    <Upload size={20} color="#212529" style={{ cursor: "pointer" }} />
                    <input type="file" name="myfile" onChange={(e) => this.UploadFileSelected(e.target.files)} />
                </div>
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className={this.props.className}
                    backdrop="static"
                >
                    <ModalHeader toggle={this.toggle}>
                        File Upload
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
                                                    <Input type="text" id="txtName" defaultValue={this.state.FileGivenName} onChange={this.nameChange.bind(this)} className="border-primary" name="name" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <Label>Name: {this.state.FileOriginalName}</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <Label>Type: {this.state.FileType}</Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <Label>Size: {this.state.FileSize}</Label>
                                            </Col>
                                        </Row>
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => {
                            this.handleSaveFileClick();
                        }}>
                            Save File
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

export default ModalFileUpload;