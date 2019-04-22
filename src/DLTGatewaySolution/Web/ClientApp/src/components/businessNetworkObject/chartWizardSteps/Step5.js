import React, { Component } from "react";
import { Row, Col, Form, FormGroup, Label, Input, Alert, Table } from "reactstrap";
import { NavLink as NavLink2, Link } from "react-router-dom";

import Spinner from "../../../components/spinner/spinner"
import ConfirmDelete from "../../../components/common/modal/ConfirmDialog";

export default class Step3 extends Component {

    constructor(props) {

        super();

        this.updateSeriesDisplayString = this.updateSeriesDisplayString.bind(this);

        this.state = {
            ChartSeries: props.ChartSeries
        };
        //this.updateSeriesDisplayString();
        
    }

    componentDidMount() {

        //if (this.state.SelectedCategoryGUID != null) {
        //    this.categoryChange(null);
        //}
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            ChartSeries: nextProps.ChartSeries
        });
        this.updateSeriesDisplayString();
    }

    updateSeriesDisplayString() {
        let stringToDisplay = '';
        this.state.ChartSeries.map(series => {
            if (stringToDisplay.length > 0) {
                stringToDisplay += ", ";
            }
            stringToDisplay += series.ObjectPropertyName;
        });
        this.setState({
            ChartSeriesDisplay: stringToDisplay
        });
    }

    
    render() {
        
        return (
            <div className="step">
                <Form>
                    <h4>Summary</h4>
                    <div className="form-body">
                        <Row>
                            <Col md="12">
                                <Row>
                                    <Col xs="12" md="6" lg="6">
                                        <ul className="no-list-style">
                                            <li>
                                                <span className="text-bold-500 primary">
                                                    <Link to="#">Chart Category</Link>
                                                </span>
                                                <span className="display-block overflow-hidden">{this.props.CategoryName}</span>
                                            </li>
                                        </ul>
                                    </Col>
                                    <Col xs="12" md="6" lg="6">
                                        <ul className="no-list-style">
                                            <li>
                                                <span className="text-bold-500 primary">
                                                    <Link to="#">Chart Type</Link>
                                                </span>
                                                <span className="display-block overflow-hidden">{this.props.TypeName}</span>
                                            </li>
                                        </ul>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" md="12" lg="12">
                                        <ul className="no-list-style">
                                            <li>
                                                <span className="text-bold-500 primary">
                                                    <Link to="#">Name</Link>
                                                </span>
                                                <span className="display-block overflow-hidden">{this.props.ChartName}</span>
                                            </li>
                                        </ul>
                                        <ul className="no-list-style">
                                            <li>
                                                <span className="text-bold-500 primary">
                                                    <Link to="#">Description</Link>
                                                </span>
                                                <span className="display-block overflow-hidden">{this.props.ChartDescription == '' ? 'N/A' : this.props.ChartDescription}</span>
                                            </li>
                                        </ul>
                                        <ul className="no-list-style">
                                            <li>
                                                <span className="text-bold-500 primary">
                                                    <Link to="#">Series</Link>
                                                </span>
                                                <span className="display-block overflow-hidden">{this.state.ChartSeriesDisplay}</span>
                                            </li>
                                        </ul>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </div>
        );
    }
}