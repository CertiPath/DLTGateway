import "react-table/react-table.css";

import React from "react";
import { toastr } from 'react-redux-toastr';
import { FileText, Globe, Trash2, CheckSquare, Upload } from 'react-feather';
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Table, CustomInput } from "reactstrap";
import { Alert } from "reactstrap";

import SidebarColor from "../settings/element/elementSidebarColor";
import InputTextbox from "../settings/element/elementInputText";
import InputCheckbox from "../settings/element/elementInputCheckBox";
import InputSelect from "../settings/element/elementInputSelect";

export default class SettingsTab extends React.Component {

    constructor(props) {
        super();
        
        this.state = {
            Data: null
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.Data != nextProps.Data) {
            this.setState({
                Data: nextProps.Data
            })
        }
    }

    render() {

        let details = this.state.Data == null ? ('') : this.state.Data.map((setting, index) => {
            return (
                setting.ValueType.toUpperCase() === 'STRING' || setting.ValueType.toUpperCase() === 'INT' ?
                    (
                        <InputTextbox
                            Label={setting.DisplayName}
                            Value={setting.Value}
                            Required={setting.Required}
                            ValueChanged={this.props.ValueChanged}
                            Setting={setting}
                        />
                    ) :
                    (
                        setting.ValueType.toUpperCase() === 'SIDEBARCOLOR' ?
                            (
                                <SidebarColor Label={setting.DisplayName} Required={setting.Required} />
                            ) :
                            (
                                setting.ValueType.toUpperCase() === 'BOOL' ?
                                    (
                                        <InputCheckbox Label={setting.DisplayName} Required={setting.Required} Setting={setting} />
                                    ) :
                                    (
                                        setting.ValueType.toUpperCase() === 'SELECT' ?
                                            (
                                                <InputSelect Label={setting.DisplayName} Options={setting.ValueReference.split(',')} Value={setting.Value} Required={setting.Required} Setting={setting} />
                                            ) :
                                            (
                                                <div>Unknown Type</div>
                                            )
                                    )
                            )
                    )
            )
        });

        return (
            <Form className="form-horizontal">
                <div className="form-body">
                    {details}
                </div>
            </Form>
        );
    }
}