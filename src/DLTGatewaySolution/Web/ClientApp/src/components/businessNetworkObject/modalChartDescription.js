import React, { Component } from "react";
import { Info } from 'react-feather';
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Modal, ModalHeader, ModalBody, ModalFooter  } from "reactstrap";

class ModalChartDescription extends Component {

    
    state = {
        modal: false,
        Data: this.props.Data
    };
    
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

   
    render() {
        return (
            <div>
                <div title={this.props.Title}>
                    <Info style={{ cursor: "pointer" }} onClick={() => this.toggle()} />
                    <Modal
                        isOpen={this.state.modal}
                        toggle={this.toggle}
                        className={this.props.className}
                    >
                        <ModalHeader toggle={this.toggle}>{this.props.Title}</ModalHeader>
                        <ModalBody>
                            {this.props.Text}
                        </ModalBody>
                        <ModalFooter></ModalFooter>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default ModalChartDescription;