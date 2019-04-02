import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class ModalExample extends Component {
    
  
   state = {
      modal: false
   };

   toggle = () => {
      this.setState({
         modal: !this.state.modal
      });
   }

   render() {
      return (
          <div>
              <Button color="primary" size="sm" onClick={this.toggle} style={{ margin: 0 }}>
                  View
            </Button>
            <Modal
               isOpen={this.state.modal}
               toggle={this.toggle}
               className={this.props.className}
               size="lg"
            >
                <ModalHeader toggle={this.toggle}>Object Details</ModalHeader>
                <ModalBody>
                <pre>
                    {this.props.text} 
                </pre>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
         </div>
      );
   }
}

export default ModalExample;