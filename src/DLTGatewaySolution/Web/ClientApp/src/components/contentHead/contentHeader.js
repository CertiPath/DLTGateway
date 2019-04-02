import React from "react";

const ContentHeader = props => {
  const {className} = props;
    return (
        <div style={{ margin: '2px 0px 4px 0px' }}
         className={`content-header${
            className === undefined ? "" : ` ${className}`
         }`}
      >
         {props.children}
      </div>
   );
};

export default ContentHeader;
