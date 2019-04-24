import React, { Component } from "react";
import { Row, Col, Form, FormGroup, Label, Input, Alert, Table, Button, CustomInput, } from "reactstrap";

export default class Step4 extends Component {
    constructor(props) {

        super();

        this.state = {
            DataValue: props.DataValue,
            DataType: props.DataType,
            ShowGridlines: props.ShowGridlines
        };
    }
    
    componentDidMount() {}

    componentWillUnmount() {}

    dataValueChange(event) {
        const value = event.target.value
        this.setState({
            DataValue: value
        });
        this.props.OnUpdateStep4Action(value, this.state.DataType, this.state.ShowGridlines);
    }

    dataTypeChange(event) {
        const value = event.target.value
        this.setState({
            DataType: value
        });
        this.props.OnUpdateStep4Action(this.state.DataValue, value, this.state.ShowGridlines);
    }

    showGrdilinesChange(event) {
        const value = event.target.checked;
        this.setState({
            ShowGridlines: value
        });
        this.props.OnUpdateStep4Action(this.state.DataValue, this.state.DataType, value);
    }

   render() {
      return (
          <div className="step step4">
              <Form>
                  <div className="form-body">
                      <Row>
                          <Col md="12">
                              <Alert color="dark">
                                  Enter number of records, minutes, hours, days or months to retrieve data for.
                                </Alert>
                          </Col>
                      </Row>
                      <Row>
                          <Col md="4">
                              <FormGroup>
                                  <Label for="dataAmount">Number/Length</Label>
                                  <Input type="text" id="dataAmount" name="dataAmount" defaultValue={this.state.DataValue} onChange={this.dataValueChange.bind(this)} />
                              </FormGroup>
                          </Col>
                          <Col md="8">
                              <FormGroup>
                                  <Label for="lengthType">Type</Label>
                                  <Input type="select" id="lengthType" name="lengthType" defaultValue={this.state.DataType} onChange={this.dataTypeChange.bind(this)}>
                                      <option value="RECORD">Records</option>
                                      <option value="MINUTE">Minutes</option>
                                      <option value="HOUR">Hours</option>
                                      <option value="DAY">Days</option>
                                      <option value="MONTH">Months</option>
                                  </Input>
                              </FormGroup>
                          </Col>
                      </Row>
                      <hr />
                      <Row>
                          <Col md="12">
                              <Label check>
                                  <CustomInput id="cbxShowGridlines" type="checkbox" checked={this.state.ShowGridlines} onChange={this.showGrdilinesChange.bind(this)} label="Show Gridlines" />
                              </Label>
                          </Col>
                      </Row>
                  </div>
              </Form>
          </div>
      );
   }
}
