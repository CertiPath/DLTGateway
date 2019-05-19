// import external modules
import React, { Component, Fragment } from "react";
import { CheckSquare } from "react-feather";
import { TabContent, TabPane, Nav, NavItem, NavLink, Button, Card, CardBody, Col, FormGroup, Input, Label, Row, Form, Alert } from "reactstrap";

import { toastr } from 'react-redux-toastr';
import Spinner from "../../components/spinner/spinner";
import apiClient from "../../utility/apiClient";
import classnames from "classnames";

import SettingsTab from "../../components/settings/tabSettingDetails";

class SystemSettings extends Component {

    constructor(props) {
        super(props);

        this.settingValueChanged = this.settingValueChanged.bind(this);

        this.state = {
            activeTab: 0,
            SettingTypes: null,
            ChangedSettings: []
        };
    }
    
    componentDidMount() {

        apiClient.get('Setting/GetAllTypes', {})
            .then(res => {
                this.setState({
                    SettingTypes: res.data
                });
                this.loadTabData(res.data[0].GUID);
            });
    }

    toggleTab = tab => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });

            // load tab if not already loaded
            if (this.state.SettingTypes[tab].Loaded == null ||
                this.state.SettingTypes[tab].Loaded == false) {
                this.loadTabData(this.state.SettingTypes[tab].GUID);
            }
        }
    };

    loadTabData(typeGUID) {
        apiClient.get('Setting/GetAll?SettingTypeGUID=' + typeGUID, {})
            .then(res => {

                this.setState(state => {
                    const details = state.SettingTypes.map(type => {
                        if (typeGUID.toUpperCase() == type.GUID.toUpperCase()) {
                            type.Data = res.data;
                            type.Loaded = true;
                        }
                    });
                    return {
                        details
                    };
                });
            });
    }

    settingValueChanged(setting) {
        let found = false;
        let list = this.state.ChangedSettings;
        for (var i = 0; i < list.length; i++) {
            if (list[i].GUID === setting.GUID) {
                list[i].Value = setting.Value;
                found = true;
                break;
            }
        }
        if (found == false) {
            list.push(setting);
        }
        this.setState({
            ChangedSettings: list
        });
    }

    saveSettings() {
        if (this.state.ChangedSettings.length > 0) {
            apiClient.post('Setting/Save', this.state.ChangedSettings)
                .then(res => {
                    toastr.success('Success', 'Settings successfully saved.', { position: 'top-right' });
                    this.setState({
                        ChangedSettings: []
                    });
                });
        }
        else {
            toastr.warning('Warning', 'No values changed.', { position: 'top-right' });
        }
        
    }

    render() {

        let tabDefs = this.state.SettingTypes == null ? '<div></div>' : this.state.SettingTypes.map((type, index) => {
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
                        {type.DisplayName}
                    </NavLink>
                </NavItem>
            )
        });

        let tabDetails = this.state.SettingTypes == null ? '<div></div>' : this.state.SettingTypes.map((type, index) => {
            return (
                <TabPane tabId={index}>
                    <SettingsTab
                        Name={type.Name}
                        Data={this.state.SettingTypes[index].Data}
                        ValueChanged={this.settingValueChanged}
                    />
                </TabPane>
            )
        });

        return (
            this.state.SettingTypes == null ? (<Spinner />) :
            (
                    <div>
                        <Row>
                            <Col sm="12" md="12">
                                <Card>
                                    <CardBody>
                                        <div>
                                            <Nav tabs className="nav-border-bottom">
                                                {tabDefs}
                                            </Nav>
                                            <TabContent activeTab={this.state.activeTab}>
                                                {tabDetails}
                                            </TabContent>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" md="12">
                                <Card>
                                    <CardBody>
                                        <div className="form-actions bottom clearfix">
                                            <div className="float-left">
                                                <Button type="submit" color="primary" style={{ margin: "0px 0px 0px 0px" }} onClick={() => {
                                                    this.saveSettings();
                                                }}>
                                                    <CheckSquare size={16} color="#FFF" /> Save Global Settings
                                                </Button>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row> 
                    </div>
            )
        );
    }
}

export default SystemSettings;
