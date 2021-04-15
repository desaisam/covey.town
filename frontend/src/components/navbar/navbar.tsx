import React from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  useDisclosure,
  useColorModeValue,
  Stack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useHistory } from 'react-router-dom';
import { useAppState } from '../VideoCall/VideoFrontend/state';
import ChangeAvatar from './ChangeAvatarMenu';

export default function NavBar(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isSignedIn, setSignedIn, avatar, setAvatar } = useAppState();
  const toast = useToast();
  const history = useHistory();
  const onClickSignIn = () => history.push('/signin');
  const onClickSignUp = () => history.push('/signup');
  const onClickSignOut = () => {
    setSignedIn(false);
    setAvatar('warrior');
    history.push('/');
    toast({
      title: `Log out Successful`,
      description: 'You have logged out Sucessfully ',
      status: 'success',
      duration: 4000,
      isClosable: true,
    });
  };

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems='center' justifyContent='space-between'>
          <IconButton
            size='md'
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label='Open Menu'
            display={{ md: !isOpen ? 'none' : 'inherit' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems='center'>
            <HStack as='nav' spacing={4} display={{ base: 'none', md: 'flex' }} />
          </HStack>
          <Flex alignItems='center'>
            {!isSignedIn && (
              <>
                <Button onClick={onClickSignIn} variant='solid' colorScheme='teal' size='sm' mr={4}>
                  Log In
                </Button>
                <Button onClick={onClickSignUp} variant='solid' colorScheme='teal' size='sm' mr={4}>
                  Register
                </Button>
              </>
            )}
            {isSignedIn && (
              <>
                <ChangeAvatar />
                <Button onClick={onOpen} variant='solid' colorScheme='teal' size='sm' mr={4}>
                  Log Out
                </Button>
                <Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset='slideInBottom'>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Think again...</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>Are you sure you want to Log out ?</ModalBody>
                    <ModalFooter>
                      <Button colorScheme='blue' mr={3} onClick={onClose}>
                        No
                      </Button>
                      <Button
                        variant='ghost'
                        onClick={ev => {
                          ev.preventDefault();
                          onClickSignOut();
                        }}>
                        Yes
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </>
            )}
            <Menu>
              <MenuButton as={Button} rounded='full' variant='link' cursor='pointer'>
                <Avatar
                  size='sm'
                  src={`${process.env.PUBLIC_URL} /assets/${avatar}.jpg`}
                />
              </MenuButton>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4}>
            <Stack as='nav' spacing={4} />
          </Box>
        ) : null}
      </Box>
    </>
  );
}
