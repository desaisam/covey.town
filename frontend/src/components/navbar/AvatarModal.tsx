import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/core';
import { useDisclosure, useToast, } from '@chakra-ui/react';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import { useAppState } from '../VideoCall/VideoFrontend/state';

export default function AvatarModal(props:{ name : string, selection : string }) : JSX.Element {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const { apiClient } = useCoveyAppState();
  const { email, setAvatar } = useAppState();
  const {name, selection} = props;
  const toast = useToast();

  const onClickYes = (value : string) => async () => {
    // Set the perty of player
    setAvatar(value);
    // console.log(`Inside avatar Modal the email is : ${email}`);
    try {
      // console.log(`Making a post request ${avatar}`);
      await apiClient.setAvatarForUser({ avatar: value, email });

      toast({
        title: 'Avatar Changed Sucessfully',
        description: 'Your avatar is changed successfully',
        status: 'success',
        duration: 1000,
      });
      onClose();
    } catch {
      toast({
        title: 'Unable to change avatar',
        description: 'Unable to change avatar. Please try again later.',
        status: 'error',
        duration: 1000,
      });
    }
  };

  // console.log(`You have Selected Outside ${avatar}`)
  return (
    <>
      <Button isFullWidth variant='ghost' onClick={onOpen}>
        {name}
      </Button>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure you want to change the Avatar?</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8} />
          <ModalFooter>
            <Button variantColor ='blue' mr={3} onClick={onClickYes(selection)}>
              Yes
            </Button>
            <Button onClick={onClose}>No</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
