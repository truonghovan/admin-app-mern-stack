import React from 'react'
import { Modal, Button } from 'react-bootstrap'
/**
* @author
* @function Modal
**/

export const NewModal = (props) => {
    return (
        <Modal size={props.size} show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{props.modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='center'>
                {props.children}
            </Modal.Body>
            <Modal.Footer>
                {
                    props.buttons ? props.buttons.map((btn,index) =>
                        <Button key={index} variant={btn.color} onClick={btn.onClick}>
                            {btn.label}
                        </Button>
                    ) :
                        <Button variant="primary" {...props} className="btn-sm" onClick={props.onSubmit} style={{backgroundColor:'#333'}}>
                            Save Changes
                        </Button>
                }

            </Modal.Footer>
        </Modal>
    )

}