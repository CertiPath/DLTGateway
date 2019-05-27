// import external modules
import React, { Component } from "react";
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { Form, Media, Collapse, Navbar, Nav, NavItem, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Mail, Menu, MoreVertical, Check, Bell, User, AlertTriangle, Lock, X, LogOut, Info } from "react-feather";

import { CurrentUserConsumer } from "../../../utility/context/currentUserContext";

import ContentHeader from "../../../components/contentHead/contentHeader";
import ContentSubHeader from "../../../components/contentHead/contentSubHeader";
import ReactCountryFlag from "react-country-flag";

class ThemeNavbar extends Component {
    handleClick = e => {
        this.props.toggleSidebarMenu("open");
    };

    constructor(props) {

        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        let notificationRows =
            <CurrentUserConsumer>
                {context => (
               
                    context.Details.Notifications.map(notification => {
                        return (
                            <Media className="px-3 pt-2 pb-2 media  border-bottom-grey border-bottom-lighten-3">
                                <Media left middle href="#" className="mr-2">
                                    <span className={"bg-" + notification.Type.toString().toLowerCase() + " rounded-circle width-35 height-35 d-block"}>
                                        {
                                            notification.Type.toUpperCase() == 'WARNING' ?
                                                <AlertTriangle size={30} className="p-1 white margin-left-3" /> :
                                                <Info size={30} className="p-1 white margin-left-3" />
                                        }
                                    </span>
                                </Media>
                                <Media body>
                                    <h6 className="mb-1 text-bold-500 font-small-3">
                                        <span className={notification.Type.toString().toLowerCase()}>{notification.Title}</span>
                                        <span className="text-bold-300 font-small-2 text-muted float-right">
                                            {notification.DateTime}
                                        </span>
                                    </h6>
                                    <p className="font-small-3 line-height-2 mb-0">
                                        {notification.Text}
                                    </p>
                                </Media>
                            </Media>
                        );
                    })
             )}
            </CurrentUserConsumer>
        
        return (
            <CurrentUserConsumer>
                {context => (
                    <Navbar className="navbar navbar-expand-lg navbar-light bg-faded">
                        <div className="container-fluid px-0">
                            <div className="navbar-header">
                                <Menu
                                    size={14}
                                    className="navbar-toggle d-lg-none float-left"
                                    onClick={this.handleClick.bind(this)}
                                    data-toggle="collapse"
                                />
                                <Form className="navbar-form mt-1 float-left" role="search">
                                    <ContentHeader>{this.props.pageTitle}</ContentHeader>
                                    <ContentSubHeader>{this.props.pageSubTitle}</ContentSubHeader>
                                    {/* <NavbarSearch /> */}
                                </Form>
                                <MoreVertical
                                    className="mt-1 navbar-toggler black no-border float-right"
                                    size={50}
                                    onClick={this.toggle}
                                />
                            </div>

                            <div className="navbar-container">
                                <Collapse isOpen={this.state.isOpen} navbar>
                                    <Nav className="ml-auto float-right" navbar>
                                        <UncontrolledDropdown nav inNavbar className="pr-1" hidden>
                                            <DropdownToggle nav>
                                                <ReactCountryFlag code="us" svg /> EN
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                                <DropdownItem>
                                                    <ReactCountryFlag code="us" svg /> English
                                                </DropdownItem>
                                                <DropdownItem>
                                                    <ReactCountryFlag code="fr" svg /> France
                                                </DropdownItem>
                                                <DropdownItem>
                                                    <ReactCountryFlag code="es" svg /> Spanish
                                                </DropdownItem>
                                                <DropdownItem>
                                                    <ReactCountryFlag code="cn" svg /> Chinese
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                        <NavItem className="pr-1" hidden>
                                            <Link to="/email/" className="nav-link">
                                                <Mail size={20} color="#333" />
                                            </Link>
                                        </NavItem>
                                        {
                                            context.Details.Notifications == null || context.Details.Notifications.length == 0 ? ('') :
                                                (
                                                    <UncontrolledDropdown nav inNavbar className="pr-1">
                                                        <DropdownToggle nav>
                                                            <span className="notification-bell-blink" />
                                                            <Bell size={21} className="text-dark notification-danger animate-shake" />
                                                        </DropdownToggle>

                                                        <DropdownMenu right className="notification-dropdown">
                                                            <div className="p-2 text-center  border-bottom-grey border-bottom-lighten-2">
                                                                <h6 className="mb-0 text-bold-500">Notifications</h6>
                                                            </div>
                                                            <PerfectScrollbar className="noti-list bg-grey bg-lighten-5">
                                                                {notificationRows}
                                                            </PerfectScrollbar>
                                                            <div className="p-1 text-center border-top-grey border-top-lighten-2">
                                                                <Link style={{ display: "none" }} to="/">View All</Link>
                                                            </div>
                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                )
                                        }


                                        <UncontrolledDropdown nav inNavbar className="pr-1">
                                            <DropdownToggle nav>
                                                <User />
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                                <DropdownItem>
                                                    <span className="font-small-3">
                                                        {context.Details.FirstName} {context.Details.LastName} <span className="text-muted">(Admin)</span>
                                                    </span>
                                                </DropdownItem>
                                                <DropdownItem divider />

                                                <Link to="/myprofile" className="p-0">
                                                    <DropdownItem>
                                                        <User size={16} className="mr-1" /> My Profile
                                                    </DropdownItem>
                                                </Link>
                                                <DropdownItem divider />
                                                <Link to="/pages/lockscreen" className="p-0" hidden>
                                                    <DropdownItem>
                                                        <Lock size={16} className="mr-1" /> Lock Screen
                                                    </DropdownItem>
                                                </Link>
                                                <Link to="/" className="p-0">
                                                    <DropdownItem>
                                                        <LogOut size={16} className="mr-1" /> Logout
                                                    </DropdownItem>
                                                </Link>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </Nav>
                                </Collapse>
                            </div>
                        </div>
                    </Navbar>      
                )}
            </CurrentUserConsumer>
         
      );
   }
}

export default ThemeNavbar;