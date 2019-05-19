import "react-table/react-table.css";

import React from "react";
import { toastr } from 'react-redux-toastr';
import { FileText, Globe, Trash2, CheckSquare, Upload } from 'react-feather';
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Table, CustomInput } from "reactstrap";
import { Alert } from "reactstrap";

import FileList from "../../businessnetwork/fileList"
import FileUploadModal from "../../fileUpload/modalFileUpload";

export default class BusinessNetworkConnectionFilesCard extends React.Component {

    constructor(props) {
        super();

        this.handleUploadFinished = this.handleUploadFinished.bind(this);
        this.handleFileDeleted = this.handleFileDeleted.bind(this);

        this.state = {
            FileList: props.FileList,
            BusinessNetworkGUID: props.BusinessNetworkGUID
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            FileList: nextProps.FileList,
            BusinessNetworkGUID: nextProps.BusinessNetworkGUID
        });
    }

    handleUploadFinished() {
        this.props.HandleFileUploaded();
    }

    handleFileDeleted() {
        this.props.HandleFileDeleted();
    }
    
    render() {
        
        return (

            <div className="px-3">
                <Form className="form-horizontal">
                    <div className="form-body">
                        <h4 className="form-section"><Globe size={20} color="#212529" /> Credential Files
                                {
                                this.state.BusinessNetworkGUID.toUpperCase() == 'NEW' ? '' :
                                    (
                                        <Row className="float-right">
                                            <Col md="12">
                                                <FileUploadModal
                                                    BusinessNetworkGUID={this.state.BusinessNetworkGUID}
                                                    HandleUploadFinished={this.handleUploadFinished}
                                                />
                                            </Col>
                                        </Row>
                                    )
                            }
                        </h4>
                        {
                            this.state.FileList == null || this.state.FileList.length === 0 ?
                                (
                                    <Alert color="dark">
                                        There are no uploaded credential files. You will not be able to connect to the network. Click on the upload file icon in order to upload files.
                                            </Alert>
                                ) :
                                (
                                    <div>
                                        <FileList
                                            FileDeletedAction={this.handleFileDeleted}
                                            BusinessNetworkGUID={this.state.BusinessNetworkGUID}
                                            FileList={this.state.FileList}
                                        />
                                    </div>
                                )
                        }
                    </div>
                </Form>
            </div>
        );
    }
}