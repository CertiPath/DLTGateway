import React from 'react';
import { connect } from 'react-redux';

const Test = props => (
    <div>
        <h1>Test Page say whaaaat</h1>
    </div>
);

export default connect()(Test);
