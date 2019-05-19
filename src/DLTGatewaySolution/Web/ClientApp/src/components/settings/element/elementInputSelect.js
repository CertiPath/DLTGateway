import React from "react";
import { AlertCircle } from "react-feather";
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Table, CustomInput } from "reactstrap";

export default class ElementInputSelect extends React.Component {

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

        let options = this.props.Options == null ? '<div></div>' : this.props.Options.map((option, index) => {
            return (
                <option value={option}>{option}</option>
            )
        });

        return (
            <FormGroup row>
                <Label sm={2} for="propertyType">{this.props.Label}</Label>
                <Col sm={5} className="position-relative has-icon-right">
                    <Input type="select" value={this.props.Value}  >
                        {options}
                    </Input>
                    {
                        this.props.Required == false ? ('') :
                            (
                                <div className="form-control-position" title="Required">
                                    <AlertCircle size={20} className="danger" style={{ margin: "0px 30px 0px -30px" }} />
                                </div>
                            )
                    }
                </Col>
            </FormGroup>
        );
    }
}