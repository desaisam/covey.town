import React, { useCallback, useState } from 'react';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/core';
import { useDisclosure, useToast } from "@chakra-ui/react"
import PropTypes from 'prop-types';
import useCoveyAppState from '../../hooks/useCoveyAppState';

export default function AvatarModal({name, selection}){
const { onOpen, isOpen, onClose } = useDisclosure()
const { apiClient, avatar, myPlayerID } = useCoveyAppState();
const [currentAvatar, setAvatar] = useState(avatar);
const toast = useToast();

const onClickYes = value => () => {
    // Set the perty of player 
    console.log(`Pusing ${value} api.ChangeAvatar : /userId/${myPlayerID}/avatar/${value}`);
    console.log(`Value ${value}`);
    console.log(`Current Avatar ${currentAvatar}`);
    setAvatar(value);
    console.log(`You have Selected ${currentAvatar}`)
    try {
      // Uncomment below when the backendd is ready
      // apiClient.changeAvatar({avatar : value, userId : '123'});
      
      toast({
        title: 'Avatar Changed Sucessfully',
        description: 'Your avatar is changed successfully',
        status: 'success',
        duration : 1000,
      });
     onClose(); 
    } catch{
      toast({
        title: 'Unable to change avatar',
        description: 'Unable to change avatar. Please try again later.',
        status: 'error',
        duration : 1000,
      });

    }
    
}

  console.log(`You have Selected Outside ${avatar}`)
  return (
    <>
     
      <Button isFullWidth  variant="ghost" onClick={onOpen}>{name}</Button>

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