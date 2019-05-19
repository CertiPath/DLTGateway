import React from "react";
import { toastr } from 'react-redux-toastr';
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Table, CustomInput } from "reactstrap";

export default class ElementInputCheckBox extends React.Component {

    constructor(props) {
        super();
        /*
        this.state = {
            Data: null
        };
        */
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.Data != nextProps.Data) {

        }
    }


    render() {

        return (
            <FormGroup check className="px-2">
                <CustomInput type="checkbox" label="NOT IMPLEMENTED"  />
            </FormGroup>
        );
    }
}