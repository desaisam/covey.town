import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';
import React from 'react';
import { Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/core';
import AvatarModal from './AvatarModal'


export default function ChangeAvatar() {

const { isOpen, onOpen, onClose } = useDisclosure()

const openModal = () => <AvatarModal/>

return (
    <Menu>
      <MenuButton variant='solid' colorScheme='teal' size='sm' mr={4} as={Button} rightIcon={<ChevronDownIcon />}>
        Change Avatar
      </MenuButton>
      <MenuList>
        <MenuItem onClick = {openModal} minH="48px">
          <Image
            boxSize="2rem" 
            borderRadius="full"
            src= { `${process.env.PUBLIC_URL} /assets/cooldude50.jpg`}
            alt="Fluffybuns the destroyer"
            mr="12px"
          />
          <AvatarModal name = "CoolDude" selection ="cooldude" />
        </MenuItem>
        <MenuItem minH="40px">
          <Image
            boxSize="2rem"
            borderRadius="full"
            src= { `${process.env.PUBLIC_URL} /assets/bardmaid.jpg`}
            alt="Barmaid"
            mr="12px"
          />
          <AvatarModal name = "Barmaid" selection ="barmaid"/>
          {/* <span>Simon the pensive</span> */}
        </MenuItem>
        <MenuItem minH="40px">
          <Image
            boxSize="2rem"
            borderRadius="full"
            src= { `${process.env.PUBLIC_URL} /assets/monk.jpg`}
            alt="Monk"
            mr="12px"
          />
          <AvatarModal name = "Monk" selection ="monk"/>
        </MenuItem>
        <MenuItem minH="40px">
          <Image
            boxSize="2rem"
            borderRadius="full"
            src= { `${process.env.PUBLIC_URL} /assets/granny.jpg`}
            alt="Granny"
            mr="12px"
          />
          <AvatarModal name = "Granny" selection ="granny"/>
        </MenuItem>
        <MenuItem minH="40px">
          <Image
            boxSize="2rem"
            borderRadius="full"
            src= { `${process.env.PUBLIC_URL} /assets/scientist.jpg`}
            alt="Scientist"
            mr="12px"
          />
          <AvatarModal name = "Scientist" selection ="scientist"/>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
