import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react'

const ProfileModal = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {props.children ? (
        <span onClick={onOpen}>{props.children}</span>
      ) : (
        <IconButton
          diaplay={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h="300px">
          <ModalHeader
          fontSize="40px"
          fontFamily="Work"
          display="flex"
          justifyContent="center"
          >{props.user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" 
          justifyContent="center" 
          alignItems="center"
          
          >
            <Text
            fontSize={{base:"28px", md:"30px"}}
            fontFamily="Work sans"
            >Email: {props.user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModal