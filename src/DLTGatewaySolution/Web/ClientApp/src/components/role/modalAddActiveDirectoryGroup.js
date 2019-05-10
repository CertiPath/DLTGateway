import React, { Component } from "react";
import { FilePlus, Edit } from 'react-feather';
import { toastr } from 'react-redux-toastr';
import apiClient from '../../utility/apiClient';
import Spinner from "../../components/spinner/spinner";
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Modal, ModalHeader, ModalBody, ModalFooter, Table  } from "reactstrap";

class ModalAddADGroup extends Component {

    timeout = null;
    state = {
        modal: false,
        GroupList: null,
        RoleGUID: this.props.RoleGUID
    };
    
    toggle = () => {
        if (this.state.modal == false) {
            this.setState({
                GroupList: null
            });
            this.searchGroups('');
        }
        this.setState({
            modal: !this.state.modal
        });
    }
    
    searchTextChange(event) {
        const inputName = event.target.value
        clearTimeout(this.timeout);
        let self = this;
        this.timeout = setTimeout(function () {
            self.searchGroups(inputName);
        }, 500);
    }

    addGroup(group) {
        this.toggle();
        let bizNetGUID = this.props.IsGlobal ? null : this.props.BusinessNetworkGUID;
        apiClient.post('Role/AddActiveDirectoryGroup', {
                Group: group,
                RoleGUID: this.state.RoleGUID,
                BusinessNetworkGUID: bizNetGUID
            })
            .then(res => {
                toastr.success('Success', 'Active directory group successfully added.', { position: 'top-right' });
                this.props.ReloadListAction(this.state.RoleGUID);
            })
            .catch(function (error) {
                toastr.error('Error', 'There was an error trying to add active directory group.', { position: 'top-right' });
            });
    }

    componentDidMount() {
        //\\
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            RoleGUID: nextProps.RoleGUID
        });
    }
    
    searchGroups(text) {
        apiClient.get('ActiveDirectory/GroupSearch?Name=' + text, {})
            .then(res => {
                this.setState({
                    GroupList: res.data
                });
            });
    }
    
    render() {

        let rows = this.state.GroupList == null ? '<div></div>' : this.state.GroupList.map(group => {
            return (
                <tr>
                    <td style={{ padding: '4px 0.75rem 4px 0.75rem' }}>{group.Name}</td>
                    <td style={{ padding: '4px 0.75rem 4px 0.75rem' }}>{group.msDSPrincipalName}</td>
                    <td style={{ padding: '4px 0.75rem 4px 0.75rem' }}>
                        <Button className="btn btn-sm" color="primary" style={{ margin: '0px 0px 0px 0px' }} onClick={() => this.addGroup(group) }>
                            Add Group
                        </Button>
                    </td>
                </tr>
            )
        });

        return (
            <div>
                <Button onClick={this.toggle}>
                    Add New Active Directory Group
                </Button>
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className="modal-dialog modal-lg"
                    backdrop="static"
                >
                    <ModalHeader toggle={this.toggle}>
                        <span>Add New Active Directory Group</span>
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md="12">
                                <Form className="form-horizontal">
                                    <div className="form-body">
                                        <Row>
                                            <Col md="12">
                                                <FormGroup>
                                                    <Label for="Search">Search</Label>
                                                    <Input type="text" id="Search" name="Search" className="border-primary" onChange={this.searchTextChange.bind(this)} />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                {
                                                    this.state.GroupList == null ? (''): (
                                                        <Table striped responsive>
                                                            <thead>
                                                                <tr>
                                                                    <th>Name</th>
                                                                    <th>Principal Name</th>
                                                                    <th>Add</th>
                                                                 </tr>
                                                             </thead>
                                                             <tbody>
                                                                {rows}
                                                             </tbody>
                                                        </Table>
                                                    )
                                                }
                                            </Col>
                                        </Row>
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default ModalAddADGroup;