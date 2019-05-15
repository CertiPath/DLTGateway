// import external modules
import React, { Component } from "react";
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { Form, Media, Collapse, Navbar, Nav, NavItem, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import {  Mail, Menu, MoreVertical, Check, Bell, User, AlertTriangle, Lock, X, LogOut } from "react-feather";

import { userFirstName, userLastName } from '../../../redux/actions/user/userActions'


import ContentHeader from "../../../components/contentHead/contentHeader";
import ContentSubHeader from "../../../components/contentHead/contentSubHeader";
import ReactCountryFlag from "react-country-flag";

const user = JSON.parse(sessionStorage.getItem('userAuth'));
const notifications = JSON.parse(sessionStorage.getItem('userNotifications'));

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
        let notificationRows = notifications == null || notifications == undefined || notifications.length == 0 ? '<div></div>' : notifications.map(notification => {
            return (
                <Media className="px-3 pt-2 pb-2 media  border-bottom-grey border-bottom-lighten-3">
                    <Media left middle href="#" className="mr-2">
                        <span className="bg-warning rounded-circle width-35 height-35 d-block">
                            <AlertTriangle size={30} className="p-1 white margin-left-3" />
                        </span>
                    </Media>
                    <Media body>
                        <h6 className="mb-1 text-bold-500 font-small-3">
                            <span className="warning">{notification.Title}</span>
                            <span className="text-bold-300 font-small-2 text-muted float-right">
                                {this.props.firstName}AAA dadsa dsa dsa dsa {notification.Time}
                            </span>
                        </h6>
                        <p className="font-small-3 line-height-2">
                            {notification.Text}
                        </p>
                    </Media>
                </Media>
            )
        });

      return (
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
                  {/* <Moon size={20} color="#333" className="m-2 cursor-pointer"/> */}
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
                            notifications.length == 0 ? ('') :
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
                                                      <Link to="/">View All</Link>
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
                                    {user.UserFirstName} {user.UserLastName} <span className="text-muted">(Admin)</span>
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
      );
   }
}

const mapStateToProps = state => ({
    firstName: state.user.userFirstName,
    lastName: state.user.userLastName,
})

const mapDispatchToProps = dispatch => ({
    userFirstName: firstName => dispatch(userFirstName(firstName)),
    userLastName: lastName => dispatch(userLastName(lastName)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ThemeNavbar)
