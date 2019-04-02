import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Trash2 } from 'react-feather';
import { toastr } from 'react-redux-toastr';
import apiClient from '../../utility/apiClient';
import Spinner from "../../components/spinner/spinner";

class ModalConfirmNamespaceDelete extends Component {
   state = {
       modal: false,
       deleting: false
   };

   toggle = () => {
      this.setState({
         modal: !this.state.modal
      });
    }

    handleClickDelete = (objectGUID) => {
        this.state.deleting = true;
        this.toggle();
        apiClient.post('BusinessNetwork/DeleteBusinessNetworkObject', {
            "GUID": objectGUID
        })
        .then(res => {
            this.state.deleting = false;
            toastr.success('Success', 'Business network object successfully deleted.', { position: 'top-right' });
            this.props.ReloadAction();

        })
        .catch(function (error) {
            this.state.deleting = false;
            toastr.error('Error', 'There was an error trying to deleted business network object.', { position: 'top-right' });
        });
    }

   render() {
       return (
           this.state.deleting == true ? (<Spinner />) : (
         <div>
              <Trash2 size={18} color="#FF586B" onClick={this.toggle} />

            <Modal
               isOpen={this.state.modal}
               toggle={this.toggle}
               className={this.props.className}
               backdrop="static"
            >
               <ModalHeader toggle={this.toggle}>Delete Namespace?</ModalHeader>
               <ModalBody>
                  Deleting this namespace will exclude it from further processing. Are you sure? 
               </ModalBody>
                  <ModalFooter>
                      <Button color="primary" onClick={() => {
                          this.handleClickDelete(this.props.GUID);
                      }}>
                     Delete
                  </Button>{" "}
                  <Button color="secondary" onClick={this.toggle}>
                     Cancel
                  </Button>
               </ModalFooter>
            </Modal>
         </div>)
      );
   }
}

export default ModalConfirmNamespaceDelete;