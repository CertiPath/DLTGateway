import React from "react";
import { AlertCircle } from "react-feather";
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Table, CustomInput } from "reactstrap";

export default class ElementInputText extends React.Component {

    constructor(props) {
        super();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.Data != nextProps.Data) {

        }
    }

    valueChanged(event) {
        const inputValue = event.target.value
        let set = this.props.Setting;
        set.Value = inputValue;
        this.props.ValueChanged(set);
    }

    render() {

        return (
            <FormGroup row>
                <Label sm={2}>{this.props.Label}:</Label>
                <Col sm={5} className="position-relative has-icon-right">
                    <Input type="text" defaultValue={this.props.Value} onChange={this.valueChanged.bind(this)} />
                    {
                        this.props.Required == false ? ('') :
                            (
                                <div className="form-control-position" title="Required">
                                    <AlertCircle size={20} className="danger" style={{ margin: "0px 30px 0px 0px" }} />
                                </div>           
                            )
                    }
                </Col>
            </FormGroup>
        );
    }
}