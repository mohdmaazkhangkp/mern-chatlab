import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon, SearchIcon } from '@chakra-ui/icons'
import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import ChatLoading from '../ChatLoading';
import axios from "axios";
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';

const SideDrawer = () => {
   const [search, setSearch] = useState("");
   const [searchResult, setSearchResult] = useState([]);
   const [loading, setLoading] = useState(false);
   const [loadingChat, setLoadingChat] = useState(false);

   const {
     user,
     setSelectedChat,
     chats,
     setChats,
     notification,
     setNotification,
   } = ChatState();
   const navigate = useNavigate();
   const { isOpen, onOpen, onClose } = useDisclosure();
   const toast = useToast();

  const logoutHandler = ()=>{
    localStorage.removeItem("userInfo");
    navigate("/");
  }

  const accessChat = async(userId)=>{
    try{
      setLoadingChat(true);
       const config = {
         headers: {
          "Content-type": "application/json",
           Authorization: `Bearer ${user.token}`,
         },
       };
       const { data } = await axios.post("/api/chat",{userId}, config);
       if(!chats.find((c)=> c._id===data._id)) setChats([data , ...chats]);
       setSelectedChat(data);
       setLoadingChat(false);
       onClose();
    }catch(error){
      toast({
        title: "Error fetching chat",
        description: error.message,
        status: "error",
        position: "bottom-left",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  }
   

  const handleSearch = async()=>{
    if(!search){
      toast({
        title: "Please Enter Something",
        status: "warning",
        position: "top-left",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try{
      setLoading(true);
      const config = {
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      };
      const {data} = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    }catch(error){
      toast({
        title: "Error Occured!",
        description:"Failed to load the search result",
        status: "error",
        position: "bottom-left",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <SearchIcon />
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          ChatLab
        </Text>
        <Menu>
          <MenuButton p={1}>
            <BellIcon fontSize="2xl" m={1} />
          </MenuButton>
          <MenuList>
            {!notification.length && "No New Messages"}
            {notification.map((notif) => (
              <MenuItem
                key={notif._id}
                onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n) => n !== notif));
                }}
              >
                {notif.chat.isGroupChat
                  ? `New Messages in ${notif.chat.chatName}`
                  : `New Messages from ${getSender(user, notif.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
            <Avatar size="sm" cursor="pointer" name={user.name} />
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer