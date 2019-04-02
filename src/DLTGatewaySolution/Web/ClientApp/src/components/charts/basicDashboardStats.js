import * as Icon from "react-feather";

import { Col, Row } from "reactstrap";
import React, { Component } from "react";

import MinimalStatisticsChart from "../../components/cards/minimalStatisticsWithChartCard";
import { StaticCardData } from "../../views/cards/staticCardData";

class DashboardBasicStatsComponent extends Component {

    render() {

        return (
            <Row className="row-eq-height">
                <Col sm="12" md="6" l="6" xl="3">
                    <MinimalStatisticsChart
                        chartData={StaticCardData.ChartistData}
                        cardBgColor="gradient-blackberry"
                        statistics={this.props.BasicDashboardStats.NumberOfNetworks}
                        text="Total Networks"
                        iconSide="right"
                    >
                        <Icon.Box size={36} strokeWidth="1.3" color="#fff" />
                    </MinimalStatisticsChart>
                </Col>
                <Col sm="12" md="6" l="6" xl="3">
                    <MinimalStatisticsChart
                        chartData={StaticCardData.ChartistData}
                        cardBgColor="gradient-ibiza-sunset"
                        statistics={this.props.BasicDashboardStats.NumberOfObjectsTracked}
                        text="Total Objects Tracked"
                        iconSide="right"
                    >
                        <Icon.File size={36} strokeWidth="1.3" color="#fff" />
                    </MinimalStatisticsChart>
                </Col>
                <Col sm="12" md="6" l="6" xl="3">
                    <MinimalStatisticsChart
                        chartData={StaticCardData.ChartistData}
                        cardBgColor="gradient-green-teal"
                        statistics={this.props.BasicDashboardStats.CountTransactionsToday}
                        text="Total Transactions Today"
                        iconSide="right"
                    >
                        <Icon.List size={36} strokeWidth="1.3" color="#fff" />
                    </MinimalStatisticsChart>
                </Col>
                <Col sm="12" md="6" l="6" xl="3">
                    <MinimalStatisticsChart
                        chartData={StaticCardData.ChartistData}
                        cardBgColor="gradient-pomegranate"
                        statistics={this.props.BasicDashboardStats.CountAllTransactions}
                        text="Total Transactions All Time"
                        iconSide="right"
                    >
                        <Icon.List size={36} strokeWidth="1.3" color="#fff" />
                    </MinimalStatisticsChart>
                </Col>
            </Row>
        );
    }
}

export default DashboardBasicStatsComponent;
