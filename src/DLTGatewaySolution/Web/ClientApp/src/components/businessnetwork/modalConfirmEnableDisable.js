import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Trash2 } from 'react-feather';

import "react-toggle/style.css"
import Toggle from "react-toggle";

class ConfirmDialog extends Component {
    
    constructor(props) {
        super();
        
        let disabledText = "Click on the enable button to make the network enabled again.";
        let enabledText = "Disabling network " + props.Name + " will exclude it from any data collection and processing. Are you sure you want to continue?";

        if (props.DisabledText != null) {
            disabledText = props.DisabledText;
        }
        if (props.EnabledText != null) {
            enabledText = props.EnabledText;
        }

        this.state = {
            modal: false,
            disabled: props.Disabled,
            modalTitle: props.Disabled == true ? "Enable network: " + props.Name + "?" : "Disable network: " + props.Name + "?",
                modalText: props.Disabled == true ?
                    disabledText :
                    enabledText,
            modalYesButtonText: props.Disabled == true ? "Enable" : "Disable",
            ReadOnly: props.ReadOnly
        };
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.Disabled !== this.props.Disabled) {
            this.setState({
                disabled: nextProps.Disabled,
                modalTitle: nextProps.Disabled == true ? "Enable network: " + nextProps.Name + "?" : "Disable network: " + nextProps.Name + "?",
                modalText: nextProps.Disabled == true ?
                    "Click on the enable button to make the network enabled again." :
                    "Disabling network " + nextProps.Name + " will exclude it from any data collection and processing. Are you sure you want to continue?",
                modalYesButtonText: nextProps.Disabled == true ? "Enable" : "Disable",
                ReadOnly: nextProps.ReadOnly
            });
        }
    }
    
    handleYesButtonClick = () => {
        this.toggle();
        this.props.YesButtonAction();
    }

    render() {
        return (
            <div title={this.state.modalTitle}>

                <Toggle
                    checked={!this.state.disabled}
                    aria-label="No label"
                    onChange={this.toggle}
                />

                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className={this.props.className}
                    backdrop="static"
                >
                    <ModalHeader toggle={this.toggle}>{this.state.modalTitle}</ModalHeader>
                    <ModalBody>
                        {
                            this.state.ReadOnly == false ? (this.state.modalText) : ('Your permissions do not allow you to enable or disable a network.')
                        }
                    </ModalBody>
                    <ModalFooter>
                        {
                            this.state.ReadOnly == true ? '' :
                                (
                                    <Button color="primary" onClick={this.handleYesButtonClick} {...(this.state.ReadOnly && { disabled: true })}>
                                        {this.state.modalYesButtonText}
                                    </Button>
                                )
                        }{" "}
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