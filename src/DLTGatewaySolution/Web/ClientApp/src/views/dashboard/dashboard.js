import { Col, Row } from "reactstrap";
import React, { Component, Fragment } from "react";

import DashboardBasicStats from "../../components/charts/basicDashboardStats";
import DashboardNamespaceTransactionsChart from "../../components/charts/namespaceTransactionsPerDay";
import Spinner from "../../components/spinner/spinner";
import axios from 'axios';
import templateConfig from "../../templateConfig";

import apiClient from "../../utility/apiClient";

class Dashboard extends Component {
    
    state = {
        basicDashboardStats: null
    }

    componentDidMount() {

        apiClient.get('Dashboard/GetBasicStats', {})
            .then(res => {
                this.setState({
                    basicDashboardStats: res.data
                });
            });

        apiClient.get('Dashboard/GetNamespaceTransactionsPerDay', {})
            .then(res => {
                this.setState({
                    namespaceTransactionsChart: res.data
                });
            });
    }
    render() {

        const { basicDashboardStats } = this.state;
        const { namespaceTransactionsChart } = this.state;

        const BasicStats = basicDashboardStats != null ? (
            <Fragment>
                <DashboardBasicStats
                    BasicDashboardStats={basicDashboardStats}
                />
            </Fragment>
        ) : (
            <div><Spinner /></div>
            );

        const NamespaceTransactionsChart = namespaceTransactionsChart != null ? (
            
            <Row>
                <Col sm="12">
                    <DashboardNamespaceTransactionsChart
                        ChartData={namespaceTransactionsChart}
                        cardTitle="Transactions per namespace - last 7 days"
                    />
                </Col>
            </Row>
        ) : (
                <div><Spinner /></div>
            );

        return (
            <div>
                {BasicStats}
                {NamespaceTransactionsChart}
            </div>
      );
   }
}

export default Dashboard;
