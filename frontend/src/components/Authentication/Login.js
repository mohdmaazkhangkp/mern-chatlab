import {
  FormControl,
  FormLabel,
  Input,
  InputRightElement,
  VStack,
  InputGroup,
  Button,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
   

const Login = () => {
     const [email, setEmail] = useState();
     const [password, setPassword] = useState();
    const [show, setShow] = useState();
     const [loading, setLoading] = useState(false);
     const toast = useToast();
     const navigate = useNavigate();
    const handleClick = () => {
      setShow((prev) => !prev);
    };
     const submitHandler = async() => {
      setLoading(true);
      if (!email || !password) {
        toast({
          title: "Please fill all the fields",
          status: "warning",
          position: "bottom",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "/api/user/login",
          { email, password },
          config
        );
        toast({
          title: "Login Successful",
          status: "success",
          position: "bottom",
          duration: 5000,
          isClosable: true,
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        navigate("/chats");
      } catch (error) {
        
        toast({
          title: "Error Occured",
          description: error.response.data.message,
          status: "error",
          position: "bottom",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
     };


  return (
    <VStack spacing="5px">
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button size="sm" height="1.75rem" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
      variant="solid"
      colorScheme="red"
      width="100%"
      onClick={()=>{
        setEmail("guest@example.com")
        setPassword("123456")
      }}
      >Get Guest User Credential</Button>
    </VStack>
  );
}

export default Login