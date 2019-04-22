import React, { Component } from "react";
import { Row, Col, Form, FormGroup, Label, Input, Alert, Table, Button } from "reactstrap";
import { Trash2 } from 'react-feather';

import Spinner from "../../../components/spinner/spinner"
import ConfirmDelete from "../../../components/common/modal/ConfirmDialog";

export default class Step3 extends Component {

    constructor(props) {

        super();

        this.addNewSeries = this.addNewSeries.bind(this);
        this.handlePropertyValueChange = this.handlePropertyValueChange.bind(this);

        let chartSettings = JSON.parse(props.ChartSettings);
        let propertyList = this.getAvailableProperties(props, chartSettings.Series);
        let propertySelectedValue = null;
        if (propertyList.length > 0) {
            propertySelectedValue = propertyList[0].GUID;
        }

        this.state = {
            Series: chartSettings.Series,
            PropertyList: propertyList,
            PropertySelectedValue: propertySelectedValue
        };
    }

    componentDidMount() {

        //if (this.state.SelectedCategoryGUID != null) {
        //    this.categoryChange(null);
        //}
    }
    
    handleClickDelete(propertyGUID) {
        
        let series = this.state.Series;

        let indexToRemove = -1;
        for (var i = 0; i < series.length; i++) {
            if (series[i].ObjectPropertyGUID.toUpperCase() == propertyGUID.toUpperCase()) {
                indexToRemove = i;
                break;
            }
        }
        if (indexToRemove > -1) {
            series.splice(indexToRemove, 1);
            let propertyList = this.getAvailableProperties(this.props, series);

            this.setState({
                Series: series,
                PropertyList: propertyList,
                PropertySelectedValue: propertyList.length > 0 ? propertyList[0].GUID : null
            });
        }
        this.props.OnSeriesUpdated(series);
    }

    getAvailableProperties(props, chartSeries) {
        let propertyList = [];
        props.PropertyList.map(property => {
            // we only care about numeric properties
            if (property.PropertyTypeCode == 'NUMERIC') {
                // we only want to make un-used numeric properties available for addition
                let found = false;
                chartSeries.map(series => {
                    if (series.ObjectPropertyGUID.toUpperCase() == property.GUID.toUpperCase()) {
                        found = true;
                    }
                });
                if (found == false) {
                    propertyList.push(property);
                }
            }
        });
        return propertyList;
    }

    addNewSeries() {
        
        let properties = this.state.PropertyList;
        let series = this.state.Series;
        let indexToRemove = -1;
        for (var i = 0; i < properties.length; i++) {
            if (this.state.PropertySelectedValue.toUpperCase() == properties[i].GUID.toUpperCase()) {
                indexToRemove = i;
                break;
            }
        }
        
        if (indexToRemove > -1) {
            series.push(
                {
                    ObjectPropertyGUID: properties[indexToRemove].GUID,
                    ObjectPropertyName: properties[indexToRemove].Name,
                });
            let propertyList = this.getAvailableProperties(this.props, series);

            this.setState({
                Series: series,
                PropertyList: propertyList,
                PropertySelectedValue: propertyList.length > 0 ? propertyList[0].GUID : null
            });
        }
        this.props.OnSeriesUpdated(series);
    }

    handlePropertyValueChange(event) {
        let propertyGUID = event.target.value;
        this.setState({
            PropertySelectedValue: propertyGUID
        });
    }

    render() {

        let properties = this.state.PropertyList == null ? '' : this.state.PropertyList.map(property => {
            return (
                <option value={property.GUID} > {property.Name}</option >  
            )
        });

        let rows = this.state.Series == null ? (<Spinner />) : this.state.Series.map(dataPoint => {
            return (
                <tr>
                    <td>
                        {dataPoint.ObjectPropertyName}
                    </td>
                    <td width="40px">
                        <Trash2 size={this.props.IconSize == null ? 18 : this.props.IconSize} color="#FF586B" onClick={() => this.handleClickDelete(dataPoint.ObjectPropertyGUID)} style={this.props.IconSize == null ? { cursor: 'pointer' } : { cursor: 'pointer', margin: "0 0 15px 0" }} />
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
                        <hr style={{ margin: "5px 0px 5px 0px" }}/>
                            {
                                properties.length > 0 ?
                                    ( 
                                        <Row>
                                        <Col md="4">
                                            <FormGroup>
                                                <FormGroup>
                                                    <Input type="select" id="propertyList" name="propertyList" defaultValue={this.state.PropertySelectedValue} onChange={this.handlePropertyValueChange}  >
                                                        {properties}
                                                    </Input>
                                                </FormGroup>
                                            </FormGroup>
                                        </Col>
                                        <Col md="8">
                                            <FormGroup>
                                                <FormGroup>
                                                    <Button onClick={this.addNewSeries}>Add New Series</Button>
                                                </FormGroup>
                                            </FormGroup>
                                            </Col>
                                        </Row>
                                ) : (
                                    <Row>
                                        <Col md="12">
                                            <Alert color="info">All numeric data points have been assigned as series.</Alert>
                                        </Col>
                                    </Row>)

                    }
                    </div>
                </Form>
            </div>
        );
    }
}