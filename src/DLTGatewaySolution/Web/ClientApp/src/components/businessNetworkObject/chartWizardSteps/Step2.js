import React, { Component } from "react";
import { Row, Col, Form, FormGroup, Label, Input, Alert } from "reactstrap";

export default class Step2 extends Component {

    constructor(props) {

        super();

        this.state = {
            ChartName: props.ChartName,
            ChartDescription: props.ChartDescription
        };
    }

    componentDidMount() {

        //if (this.state.SelectedCategoryGUID != null) {
        //    this.categoryChange(null);
        //}
    }

    nameChange(event) {
        const name = event.target.value
        this.props.ChartNameChangedAction(name);
    }

    descriptionChange(event) {
        const desc = event.target.value
        this.props.ChartDescriptionChangedAction(desc);
    }

    render() {

        return (
            <div className="step step1">
                <Form>
                    <div className="form-body">
                        <Row>
                            <Col md="12">
                                <FormGroup>
                                    <Label for="chartName">Chart Name</Label>
                                    <Input type="text" id="chartName" name="chartName" defaultValue={this.state.ChartName} onChange={this.nameChange.bind(this)} />
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col md="12">
                                <FormGroup>
                                    <FormGroup>
                                        <Label for="chartDescription">Chart Description</Label>
                                        <Input type="textarea" id="chartDescription" name="chartDescription" defaultValue={this.state.ChartDescription} onChange={this.descriptionChange.bind(this)}  />
                                    </FormGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </div>
        );
    }
}