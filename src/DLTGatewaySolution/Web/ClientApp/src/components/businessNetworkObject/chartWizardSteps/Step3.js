import React, { Component } from "react";
import { Row, Col, Form, FormGroup, Label, Input, Alert, Table } from "reactstrap";

import Spinner from "../../../components/spinner/spinner"
import ConfirmDelete from "../../../components/common/modal/ConfirmDialog";

export default class Step3 extends Component {

    constructor(props) {

        super();

        let chartSettings = JSON.parse(props.ChartSettings);

        this.state = {
            Series: chartSettings.Series
        };
    }

    componentDidMount() {

        //if (this.state.SelectedCategoryGUID != null) {
        //    this.categoryChange(null);
        //}
    }

    /*
    nameChange(event) {
        const name = event.target.value
        this.props.ChartNameChangedAction(name);
    }
    */

    handleClickDelete() {
        alert('alooo');
    }

    render() {

        let rows = this.state.Series == null ? (<Spinner />) : this.state.Series.map(dataPoint => {
            return (
                <tr>
                    <td>
                        {dataPoint.ObjectPropertyName}
                    </td>
                    <td width="40px">
                        <ConfirmDelete
                            Title={"Delete " + dataPoint.ObjectPropertyName + "?"}
                            Text={"You are about to delete configured chart " + dataPoint.ObjectPropertyName + ". Once you delete it all the configuration will be gone. Do you want to continue?"}
                            YesButtonText="Delete"
                            YesButtonAction={() => this.handleClickDelete(dataPoint.ObjectPropertyGUID)}
                        />
                    </td>
                </tr>
            )
        });

        return (
            <div className="step step1">
                <Form>
                    <div className="form-body">
                        <Row>
                            <Col md="12">
                                <Alert color="dark">
                                    Data series to be shown in chart.
                                </Alert>
                            </Col>
                        </Row>

                        <Row>
                            <Col md="12">
                                <Table striped responsive>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th width="40px"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>

                        <Row>
                            <Col md="12">
                                <FormGroup>
                                    <FormGroup>
                                        Button Here
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