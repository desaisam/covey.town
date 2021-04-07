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
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        Change Avatar
      </MenuButton>
      <MenuList>
        <MenuItem onClick = {openModal} minH="48px">
          <Image
            boxSize="2rem" 
            borderRadius="full"
            src="https://placekitten.com/50/50"
            alt="Fluffybuns the destroyer"
            mr="12px"
          />
          <AvatarModal name = "CoolDude" selection ="CoolDude.png" />
        </MenuItem>
        <MenuItem minH="40px">
          <Image
            boxSize="2rem"
            borderRadius="full"
            src="https://placekitten.com/50/50"
            alt="Simon the pensive"
            mr="12px"
          />
          <AvatarModal name = "Barmaid" selection ="Barmaid.png"/>
          {/* <span>Simon the pensive</span> */}
        </MenuItem>
        <MenuItem minH="40px">
          <Image
            boxSize="2rem"
            borderRadius="full"
            src="https://placekitten.com/50/50"
            alt="Simon the pensive"
            mr="12px"
          />
          <AvatarModal name = "Warrior" selection ="Warrior.png"/>
        </MenuItem>
        
      </MenuList>
    </Menu>
  );
}
