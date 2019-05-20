import React from "react";
import { ShoppingCart } from "react-feather";

import templateConfig from "../../../templateConfig";
import strings from "../../../app/localizedStrings";

const today = new Date();

const Footer = props => (
    
   <footer>
        {templateConfig.buyNow ? (
         <a
            href="http://www.certipath.com/"
            className="btn btn-floating btn-buynow gradient-pomegranate btn-round shadow-z-3 px-3 white"
            target="_blank"
            rel="noopener noreferrer"
         >
            <ShoppingCart size={16} />
            {"  "}Buy Now
         </a>
      ) : (
         ""
      )}
      <div className="container-fluid">
         <p className="text-center">
            © { today.getFullYear() } {" "}
            {strings.App.Title}{" "}
            Powered by <i className="ft-heart font-small-3" />            
            <a href="http://www.certipath.com/" rel="noopener noreferrer" target="_blank">
               {" "}
               CertiPath
            </a>
            </p>
            <p class="text-center small">Version: blah</p>
      </div>
   </footer>
);

export default Footer;
