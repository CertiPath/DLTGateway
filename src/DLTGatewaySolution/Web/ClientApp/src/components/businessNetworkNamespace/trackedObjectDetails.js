import "react-table/react-table.css";

import React from "react";
import { toastr } from 'react-redux-toastr';
import { FileText, Edit, Trash2, CheckSquare } from 'react-feather';
import Spinner from "../../components/spinner/spinner";
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, Row, Col, Form, CardBody, Table } from "reactstrap";
import classnames from "classnames";

import apiClient from "../../utility/apiClient";
import TabProperties from "../businessNetworkNamespace/tabProperties";
import TabChartList from "../businessNetworkNamespace/tabChartList";

export default class TrackedObjectList extends React.Component {
    constructor(props) {
        super();

        this.onFinishedAddEdit = this.onFinishedAddEdit.bind(this);
        
        this.state = {
            activeTab: "1",
            ObjectDetails: null,
            ChartListLoaded: false,
            ObjectChartList: null
        };
    }
    
    toggleTab = tab => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });

            if (tab == "2") {
                if (this.state.ChartListLoaded == false) {
                    this.loadCharts(this.state.ObjectGUID);
                    this.setState({
                        ChartListLoaded: true
                    });
                }
            }
        }
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            ObjectGUID: nextProps.SelectedObjectGUID
        });
        this.loadData(nextProps.SelectedObjectGUID);
    }

    onFinishedAddEdit() {
        this.loadData(this.state.ObjectGUID);
    }
    
    loadData(objGUID) {
        apiClient.get('BusinessNetworkObject/GetDetails?BusinessNetworkObjectGUID=' + objGUID, {})
            .then(res => {
                this.setState({
                    ObjectDetails: res.data
                });
            });
    }

    loadCharts(objGUID) {
        apiClient.get('BusinessNetworkObject/GetCharts?BusinessNetworkObjectGUID=' + objGUID, {})
            .then(res => {
                this.setState({
                    ObjectChartList: res.data.ChartList,
                    ChartCategoryList: res.data.CategoryList,
                    ChartTypeList: res.data.TypeList,
                });
            });
    }

    render() {

        let rows = this.state.ObjectDetails == null ? '<div></div>' : this.state.ObjectDetails.PropertyList.map(dataField => {
            return (
                <tr>
                    <td>{dataField.Name}</td>
                    <td>{dataField.Disabled}</td>
                    <td>{dataField.Visible}</td>
                    <td></td>
                    <td></td>
                </tr>
            )
        });

        return (
            this.state.ObjectDetails == null ? (<Spinner />) :
            (
            <div>
                <Card>
                    <CardBody>
                        <div className="px-3">
                            <Form className="form-horizontal">
                                <div className="form-body">
                                    <h4 className="form-section"><FileText size={20} color="#212529" /> {this.props.SelectedObjectName}</h4>
                                    <div>
                                        <Nav tabs className="nav-border-bottom">
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({
                                                        active: this.state.activeTab === "1"
                                                    })}
                                                    onClick={() => {
                                                        this.toggleTab("1");
                                                    }}
                                                >
                                                    Properties
                                            </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({
                                                        active: this.state.activeTab === "2"
                                                    })}
                                                    onClick={() => {
                                                        this.toggleTab("2");
                                                    }}
                                                >
                                                    Data Views/Charts
                                            </NavLink>
                                            </NavItem>
                                        </Nav>
                                        <TabContent activeTab={this.state.activeTab}>
                                            <TabPane tabId="1">
                                                <TabProperties
                                                    ObjectDetails={this.state.ObjectDetails}
                                                    onFinishedAddEdit={this.onFinishedAddEdit}
                                                />
                                            </TabPane>
                                            <TabPane tabId="2">
                                               <TabChartList
                                                    BusinessNetworkObjectGUID={this.state.ObjectGUID}
                                                    ChartList={this.state.ObjectChartList}
                                                    ChartCategoryList={this.state.ChartCategoryList}
                                                    ChartTypeList={this.state.ChartTypeList}
                                                    PropertyList={this.state.ObjectDetails.PropertyList}
                                                    ReloadListAction={() => this.loadCharts(this.state.ObjectGUID)}
                                                />
                                            </TabPane>
                                        </TabContent>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </CardBody>
                </Card>
            </div>
            )
        );
    }
}