// import external modules
import React, { Component } from "react";

import { CurrentUserConsumer } from "../../../../utility/context/currentUserContext";
import {
   Home,
   ChevronRight,
   Box,
   Users,
   Settings,
   Database
} from "react-feather";
import { NavLink } from "react-router-dom";

// Styling
import "../../../../assets/scss/components/sidebar/sidemenu/sidemenu.scss";
// import internal(own) modules
import SideMenu from "../sidemenuHelper";

class SideMenuContent extends Component {

    render() {

      return (

          <CurrentUserConsumer>
              {context => (

                  <SideMenu className="sidebar-content" toggleSidebarMenu={this.props.toggleSidebarMenu}>
                      <SideMenu.MenuSingleItem>
                          <NavLink to="/Dashboard" activeclassname="active">
                              <i className="menu-icon">
                                  {<Home size={18} />}
                              </i>
                              <span className="menu-item-text">Dashboard</span>
                          </NavLink>
                      </SideMenu.MenuSingleItem>
                      <SideMenu.MenuMultiItems
                          name="Business Network"
                          Icon={<Box size={18} />}
                          ArrowRight={<ChevronRight size={16} />}
                          collapsedSidebar={this.props.collapsedSidebar}
                      >
                          <NavLink to="/BusinessNetwork/List" className="item" activeclassname="active">
                              <span className="menu-item-text">View All</span>
                          </NavLink>
                          <NavLink to="/BusinessNetwork/Details/New" className="item" activeclassname="active" style={JSON.stringify(context.Details.IsSuperAdmin) === "false" && JSON.stringify(context.Details.IsGlobalAdmin) === "false" ? { display: 'none' } : {}}>
                              <span className="menu-item-text">Add New</span>
                          </NavLink>
                      </SideMenu.MenuMultiItems>
                      <SideMenu.MenuSingleItem>
                          <NavLink to="/DataStore" activeclassname="active">
                              <i className="menu-icon">
                                  {<Database size={18} />}
                              </i>
                              <span className="menu-item-text">Data Store</span>
                          </NavLink>
                      </SideMenu.MenuSingleItem>
                      <SideMenu.MenuMultiItems
                          name="Settings"
                          Icon={<Settings size={18} />}
                          ArrowRight={<ChevronRight size={16} />}
                          collapsedSidebar={this.props.collapsedSidebar}
                          visible={JSON.stringify(context.Details.IsSuperAdmin) === "false" && JSON.stringify(context.Details.IsGlobalAdmin) === "false" ? false : true}
                      >
                          
                          <NavLink to="/Settings/Roles" className="item" activeclassname="active">
                              <span className="menu-item-text">Roles</span>
                          </NavLink>
                      </SideMenu.MenuMultiItems>
                      <SideMenu.MenuSingleItem
                          visible={JSON.stringify(context.Details.IsSuperAdmin) === "false" && JSON.stringify(context.Details.IsGlobalAdmin) === "false" ? false : true}
                      >
                          <NavLink to="/Users" activeclassname="active">
                              <i className="menu-icon">
                                  {<Users size={18} />}
                              </i>
                              <span className="menu-item-text">Users</span>
                          </NavLink>
                      </SideMenu.MenuSingleItem>
                  </SideMenu>        
            )}
          </CurrentUserConsumer>

          
      );
   }
}

export default SideMenuContent;
