import React, { Component } from "react";
import { Row, Col, Form, FormGroup, Label, Input, Alert, Table, Button, CustomInput, } from "reactstrap";

export default class Step6 extends Component {
   state = {};

   componentDidMount() {}

   componentWillUnmount() {}

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
                                  <Input type="text" id="dataAmount" name="dataAmount" />
                              </FormGroup>
                          </Col>
                          <Col md="8">
                              <FormGroup>
                                  <Label for="lengthType">Type</Label>
                                  <Input type="select" id="lengthType" name="lengthType">
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
                                  <CustomInput type="checkbox" defaultChecked label="Show Gridlines" />
                              </Label>
                          </Col>
                      </Row>
                  </div>
              </Form>
          </div>
      );
   }
}
