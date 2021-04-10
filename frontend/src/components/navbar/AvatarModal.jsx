import React from 'react';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/core';
import { useDisclosure } from "@chakra-ui/react"
import PropTypes from 'prop-types';

export default function AvatarModal({name, selection}){
const { onOpen, isOpen, onClose } = useDisclosure()

const onClickYes = value => () => {
    // Set the perty of player 
    alert(`You have Selected ${value}`)
}
  return (
    <>
      <Button onClick={onOpen}>{name}</Button>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure you want to change the Avatar?</ModalHeader>
          <ModalCloseButton /> 
          <ModalBody pb={8}/>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick = {onClickYes(selection)}>
              Yes
            </Button>
            <Button onClick={onClose}>No</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}; 

AvatarModal.propTypes  = {
  name : PropTypes.string.isRequired,
  selection : PropTypes.string.isRequired
}