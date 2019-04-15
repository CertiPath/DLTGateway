import { Box, BarChart, Maximize, Minimize } from "react-feather";
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { TabContent, TabPane, Nav, NavItem, NavLink, Button, Card, CardBody, Col, FormGroup, Input, Label, Row, Form, Alert } from "reactstrap";
import { toastr } from 'react-redux-toastr';
import React, { Component, Fragment } from "react";
import Select from "react-select";
import { NavLink as NavLink2, Link } from "react-router-dom";
import { Bar, Line, Scatter, Pie, Doughnut } from "react-chartjs-2";
import classnames from "classnames";

import Spinner from "../../components/spinner/spinner";
import apiClient from "../../utility/apiClient";


class BusinessNetworkObject extends Component {
    constructor(props) {
        super(props);

        this.handleChartAreaMax = this.handleChartAreaMax.bind(this);
        this.handleChartAreaMin = this.handleChartAreaMin.bind(this);

        this.state = {
            activeTab: 0,
            ObjectDetails: null,
            ChartData: null,
            ObjectGUID: props.match.params.id,
            ChartAreaMaximized: false
        };
    }

    toggleTab = tab => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });

            // load tab if not already loaded
            if (this.state.ObjectDetails.ChartList[tab].Loaded == null ||
                this.state.ObjectDetails.ChartList[tab].Loaded == false) {
                this.loadChart(this.state.ObjectDetails.ChartList[tab].GUID);
            }
        }
    };

    componentDidMount() {
        this.loadDetails(this.state.ObjectGUID);
    }

    loadDetails(objGUID) {
        apiClient.get('DataStore/Get?GUID=' + objGUID, {})
            .then(res => {
                
                this.setState({
                    ObjectDetails: res.data
                });

                // load chart one if any found
                if (res.data.ChartList.length > 0) {
                    this.loadChart(res.data.ChartList[0].GUID);
                }
            });
    }

    loadChart(chartGUID) {
        apiClient.get('DataStore/GetChart?GUID=' + chartGUID, {})
            .then(res => {

                this.setState(state => {
                    const details = state.ObjectDetails.ChartList.map(chart => {
                        if (chartGUID == chart.GUID) {
                            chart.ChartData = res.data.ChartData;
                            chart.Loaded = true;
                        }
                    });

                    return {
                        details
                    };
                });
            });
    }

    handleChartAreaMax() {
        this.setState({
            ChartAreaMaximized: true
        });
    }

    handleChartAreaMin() {
        this.setState({
            ChartAreaMaximized: false
        });
    }

    render() {
        
        let rows = this.state.ObjectDetails == null ? '<div></div>' : this.state.ObjectDetails.PropertyValues.map(item => {
            return (
                <li>
                    <span className="text-bold-500 primary">
                        <Link to="/pages/useer-profile">{item.Name}</Link>
                    </span>
                    <span className="display-block overflow-hidden">{item.Value}</span>
                </li>
            )
        });

        let tabDefs = this.state.ObjectDetails == null ? '<div></div>' : this.state.ObjectDetails.ChartList.map((chart, index) => {
            return (
                <NavItem>
                    <NavLink
                        className={classnames({
                            active: this.state.activeTab == index
                        })}
                        onClick={() => {
                            this.toggleTab(index);
                        }}
                    >
                        {chart.Name}
                    </NavLink>
                </NavItem>
            )
        });

        let tabDetails = this.state.ObjectDetails == null ? '<div></div>' : this.state.ObjectDetails.ChartList.map((chart, index) => {
            return (
                <TabPane tabId={index}>
                    <div style={{ width: "100%" }}>
                        {
                            this.state.ObjectDetails.ChartList[index].ChartData == null ? (<Spinner />) : 
                                (
                                    <Line height={500}
                                        data={this.state.ObjectDetails.ChartList[index].ChartData.data}
                                        options={this.state.ObjectDetails.ChartList[index].ChartData.options}
                                        style={{ display: "block" }} />
                                )
                        }
                    </div>
                </TabPane>
            )
        });

        return (
            this.state.ObjectDetails != null ? (
                <Fragment>
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <NavLink2 to="/DataStore">Data Store</NavLink2>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>{this.state.ObjectDetails.ObjectName}: {this.state.ObjectDetails.SourceID}</BreadcrumbItem>
                    </Breadcrumb>

                    <Row>
                        <Col sm="12" md="3" style={this.state.ChartAreaMaximized ? { display: "none" } : {}}>
                            <Card>
                                <CardBody>
                                    <div className="px-3">
                                        <Form className="form-horizontal">
                                            <div className="form-body">
                                                <h4 className="form-section"><Box size={20} color="#212529" /> Object Properties</h4>

                                                <Row>
                                                    <Col xs="12" md="12" lg="12">
                                                        <ul className="no-list-style">
                                                            {rows}
                                                        </ul>
                                                    </Col>
                                                </Row>

                                            </div>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col sm="12" md={this.state.ChartAreaMaximized ? "12" : "9"}>
                            <Card>
                                <CardBody>
                                    <div className="px-3">
                                        <Form className="form-horizontal">
                                            <div className="form-body">
                                                <h4 className="form-section"><BarChart size={20} color="#212529" /> Data Views
                                                    <div className="float-right" title={this.state.ChartAreaMaximized ? "Minimize Chart" : "Maximize Chart"}>
                                                        {
                                                            this.state.ChartAreaMaximized == false ? 
                                                                (
                                                                    <Maximize onClick={this.handleChartAreaMax} style={{ cursor: "pointer" }} />
                                                                ) :
                                                                (
                                                                    <Minimize onClick={this.handleChartAreaMin} style={{ cursor: "pointer" }} />
                                                                )
                                                        }
                                                    </div>
                                                </h4>
                                                <div>
                                                    {
                                                        this.state.ObjectDetails.ChartList.length > 0 ? ( 
                                                            <div>
                                                                <Nav tabs className="nav-border-bottom">
                                                                    {tabDefs}
                                                                </Nav>
                                                                <TabContent activeTab={this.state.activeTab}>
                                                                    {tabDetails}
                                                                </TabContent>
                                                            </div>
                                                        ) :
                                                        (
                                                            <Alert color="dark">
                                                                There are no configured charts for this tracked object type.
                                                            </Alert>
                                                        )
                                                    }

                                                    
                                                </div>
                                            </div>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </Fragment>
            ) : (
                    <div><Spinner /></div>
                )
        );
    }
}

export default BusinessNetworkObject;
