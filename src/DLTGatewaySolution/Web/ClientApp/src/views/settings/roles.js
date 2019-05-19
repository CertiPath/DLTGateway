import { Card, CardBody, Col, Row } from "reactstrap";
import React, { Component, Fragment } from "react";

import RoleTableCard from "../../components/role/list/TableCard";
import RoleDetails from "../../components/role/RoleDetails";

class RoleListPage extends Component {

    constructor(props) {
        super(props);
        this.OnRoleSelected = this.OnRoleSelected.bind(this);

        this.state = {
            SelectedRoleGUID: null,
            SelectedRoleName: ''
        };
    }

    OnRoleSelected(selectedRoleGUID, selectedRoleName) {
        this.setState({
            SelectedRoleGUID: selectedRoleGUID,
            SelectedRoleName: selectedRoleName
        });
    }

    render() {
        return (
            <Fragment>
                <Row>
                    <Col sm="12" md={this.state.SelectedRoleGUID == null ? "12" : "3"}>
                        <RoleTableCard
                            IsGlobal={true}
                            OnRoleSelected={this.OnRoleSelected}
                        />
                    </Col>
                    <Col sm="12" md="9" style={this.state.SelectedRoleGUID == null ? { display: 'none' } : {}}>
                        <RoleDetails
                            SelectedRoleGUID={this.state.SelectedRoleGUID}
                            SelectedRoleName={this.state.SelectedRoleName}
                            IsGlobal={true}
                        />
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default RoleListPage;