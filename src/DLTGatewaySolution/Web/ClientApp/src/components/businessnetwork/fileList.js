import "react-table/react-table.css";

import React from "react";
import { toastr } from 'react-redux-toastr';
import { FileText, Globe, Trash2, CheckSquare } from 'react-feather';
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Table } from "reactstrap";
import Spinner from "../../components/spinner/spinner";
import { Alert } from "reactstrap";
import { NavLink } from "react-router-dom";

import apiClient from "../../utility/apiClient";
import ConfirmDelete from "../../components/common/modal/ConfirmDialog";
import AddEditNamespace from "../../components/businessnetwork/modalAddEditNamespace"

export default class BusinessNetworkFileList extends React.Component {
    constructor(props) {
        
        super(props);
        
        this.state = {
            FileList: props.FileList,
            BusinessNetworkGUID: props.BusinessNetworkGUID,
            ReadOnly: props.ReadOnly
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            FileList: nextProps.FileList,
            BusinessNetworkGUID: nextProps.BusinessNetworkGUID,
            ReadOnly: nextProps.ReadOnly
        });
    }
    
    handleClickDelete = (fileGUID) => {
        
        apiClient.post('BusinessNetwork/DeleteConnectionFile', {
            "GUID": fileGUID
        })
        .then(res => {
            toastr.success('Success', 'Connection file successfully deleted', { position: 'top-right' });
            this.props.FileDeletedAction();
        })
        .catch(function (error) {
            toastr.error('Error', 'There was an error trying to delete a connection file.', { position: 'top-right' });
        });
    }

    render() {
        let rows = this.state.FileList == null ? '<div></div>' : this.state.FileList.map(file => {
            return (
                <tr>
                    <td>{file.Name}</td>
                    <td>{file.TypeExtension}</td>
                    <td style={{ paddingLeft: 0, paddingRight: 0, cursor: 'pointer' }} title="Delete File">
                        {
                            this.state.ReadOnly == true ? ('') : (
                                <ConfirmDelete
                                    Title={"Delete File " + file.Name + "?"}
                                    Text={"You are about to delete file " + file.Name + ". Once deleted you may not be able to connect a blockchain network. Are you sure you want to continue?"}
                                    YesButtonText="Delete"
                                    YesButtonAction={() => this.handleClickDelete(file.GUID)}
                                />
                            )
                        }
                    </td>
                </tr>
            )
        });

        return (

            <Table striped responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th width="40"></th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>

        );
    }
}