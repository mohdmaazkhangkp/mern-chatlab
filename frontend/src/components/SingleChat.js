import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = "https://mern-chatlab.onrender.com";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
   const [messages, setMessages] = useState([]);
   const [loading, setLoading] = useState(false);
   const [newMessage, setNewMessage] = useState("");
   const [socketConnected, setSocketConnected] = useState(false);
  const { user, selectedChat, setSelectedChat,  notification, setNotification} = ChatState();
   const toast = useToast();
 useEffect(() => {
   socket = io(ENDPOINT);
   socket.emit("setup", user);
   socket.on("connection", () => setSocketConnected(true));
 }, []);
 
 useEffect(() => {
   fetchMessages();
   selectedChatCompare = selectedChat;
 }, [selectedChat]);

 useEffect(() => {
   socket.on("message received", (newMessageReceived)=>{
    if(
      !selectedChatCompare || selectedChatCompare._id!==newMessageReceived.chat._id
    ){
      // give notification
      if(!notification.includes(newMessageReceived)){
        setNotification([newMessageReceived, ...notification]);
        setFetchAgain(!fetchAgain);
        console.log(notification)
      }
    } else{
      setMessages([...messages, newMessageReceived])
    }
   })
 });

const fetchMessages = async()=>{
  if(!selectedChat) return;
  
  try{
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    setLoading(true);
    const { data } = await axios.get(
      `/api/message/${selectedChat._id}`,
      config
    );
    setMessages(data);
    console.log(messages);
    setLoading(false);
    socket.emit("join chat", selectedChat._id);

  }catch(error){
     toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
  }
}



  const sendMessage = async(event)=>{
    if(event.key==="Enter" && newMessage){
      try{
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);

        setMessages([...messages, data]);
      }catch(error){
         toast({
           title: "Error Occured!",
           description: "Failed to send the Message",
           status: "error",
           duration: 5000,
           isClosable: true,
           position: "bottom",
         });
      }
    
  }
  }

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    //typing indicator logic
  }


  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflow="auto"
          >
           
              {loading ? (
                <Spinner
                  size="xl"
                  w={20}
                  h={20}
                  alignSelf="center"
                  margin="auto"
                />
              ) : (
                <div style={{ height: "80vh", overflowY: "scroll", display: "flex", flexDirection:"column" }}>
                  <ScrollableChat messages={messages} />
                </div>
              )}
           
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
