import React, { Component } from "react";
import { Row, Col, Form, FormGroup, Label, Input, Alert } from "reactstrap";

export default class Step1 extends Component {

    constructor(props) {

        super();

        this.state = {
            SelectedCategoryGUID: props.ChartCategoryGUID,
            SelectedTypeGUID: props.ChartTypeGUID,
            SelectedCategoryDescription: '',
            TypeList: null
        };

    }
    
    componentDidMount() {

        if (this.state.SelectedCategoryGUID != null) {
            this.categoryChange(null);
        }
    }
    
    categoryChange(event) {

        let categoryGUID = event != null ? event.target.value : this.state.SelectedCategoryGUID

        // get type list
        let typeList = [];
        this.props.TypeList.map(type => {
            if (type.ChartCategoryGUID == categoryGUID) {
                typeList.push(type);
            }
        });

        // category description
        let categoryDescription = '';
        let categoryName = '';
        this.props.CategoryList.map(category => {
            if (category.GUID == categoryGUID) {
                categoryDescription = category.Description;
                categoryName = category.Name;
            }
        });

        this.setState({
            SelectedCategoryGUID: categoryGUID,
            SelectedCategoryDescription: categoryDescription,
            TypeList: typeList
        })

        // must set type to the first type
        this.props.ChartTypeChangedAction(typeList[0].GUID, typeList[0].Name);
        this.props.ChartCategoryChangedAction(categoryGUID, categoryName);
    }

    typeChange(event) {

        let typeGUID = event.target.value;
        let typeName = '';
        this.props.TypeList.map(type => {
            if (type.GUID == typeGUID) {
                typeName = type.Name;
            }
        });

        this.props.ChartTypeChangedAction(typeGUID, typeName);
    }

    render() {

        let categoryOptions = this.props.CategoryList == null ? '' : this.props.CategoryList.map(category => {
            return (
                this.state.SelectedCategoryGUID == category.GUID ? (
                    <option value={category.GUID} selected>{category.Name}</option>
                ) : (
                        <option value={category.GUID} > {category.Name}</option >
                    ) 
                )
        });

        let typeOptions = this.state.TypeList == null ? '' : this.state.TypeList.map(type => {
            return (
                this.state.SelectedTypeGUID == type.GUID ? (
                    <option value={type.GUID} selected>{type.Name}</option>
                ) :
                (
                    <option value={type.GUID} > {type.Name}</option >
                )
            )
        });

      return (
         <div className="step step1">
              <Form>
                  <div className="form-body">
                      <Row>
                          <Col md="12">
                              <FormGroup>
                                  <Label for="chartCategory">Chart Category</Label>
                                  <Input type="select" id="chartCategory" name="chartCategory" onChange={this.categoryChange.bind(this)} >
                                      <option value="" defaultValue="">
                                          
                                      </option>
                                      {categoryOptions}
                                  </Input>
                              </FormGroup>
                          </Col>
                          <Col md="12">
                              <FormGroup>
                                  {
                                      this.state.SelectedCategoryDescription == '' ? '' : (
                                          <Alert color="dark">
                                              {this.state.SelectedCategoryDescription}
                                          </Alert>       
                                      )
                                  }
                              </FormGroup>
                          </Col>
                      </Row>

                      {
                          this.state.SelectedCategoryGUID == null || this.state.SelectedCategoryGUID == '' ? '' : 
                              (
                                  <Row>
                                      <Col md="12">
                                          <FormGroup>
                                              <Label for="chartType">Chart Type</Label>
                                              <Input type="select" id="chartType" name="chartType" onChange={this.typeChange.bind(this)}>
                                                  {typeOptions}
                                              </Input>
                                          </FormGroup>
                                      </Col>
                                  </Row>           
                              )
                      }
                  </div>
              </Form>
         </div>
      );
   }
}
