import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Trash2 } from 'react-feather';
//import apiClient from '../../utility/apiClient';
import Spinner from "../../../components/spinner/spinner";

class ConfirmDialog extends Component {
    state = {
        modal: false
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }
    
    handleYesButtonClick = () => {
        this.toggle();
        this.props.YesButtonAction();
    }

    render() {
        return (
            <div title={this.props.Title}>
                <Trash2 size={this.props.IconSize == null ? 18 : this.props.IconSize} color="#FF586B" onClick={this.toggle} style={this.props.IconSize == null ? { cursor: 'pointer' } : { cursor: 'pointer', margin: "0 0 15px 0" }} />

                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className={this.props.className}
                    backdrop="static"
                >
                    <ModalHeader toggle={this.toggle}>{this.props.Title}</ModalHeader>
                    <ModalBody>
                        {this.props.Text}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleYesButtonClick}>
                            {this.props.YesButtonText}
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

export default ConfirmDialog;