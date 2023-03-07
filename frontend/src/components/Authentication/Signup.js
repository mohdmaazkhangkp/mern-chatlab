import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const Signup = () => {
    const[name, setName] = useState();
    const [email, setEmail] = useState();
    const[password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [show, setShow] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const handleClick = ()=>{
        setShow((prev)=>!prev);
    }
    const submitHandler = async()=>{
      setLoading(true);
      if(!name || !email || !password || !confirmPassword){
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
      if (password !== confirmPassword) {
        toast({
          title: "Password not match",
          status: "warning",
          position: "bottom",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
try{
  const config={
    headers:{
      "Content-type":"application/json"
    },
  };
  const {data} = await axios.post(
    "/api/user",
    {name, email,password}, config
  );
  toast({
    title: "Registration Successful",
    status: "success",
    position: "bottom",
    duration: 5000,
    isClosable: true,
  });
   localStorage.setItem("userInfo", JSON.stringify(data));
  setLoading(false);
  navigate('/chats');
}
catch(error){
  toast({
    title: "Error Occured",
    description: error.response.data.message,
    status: "error",
    position: "bottom",
    duration: 5000,
    isClosable: true,
  });
  setLoading(false);
}}
  

  return (
    <VStack spacing="5px">
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button size="sm" height="1.75rem" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confrim Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
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
      style={{marginTop:15}}
      onClick={submitHandler}
      isLoading={loading}
      >Sign Up</Button>
    </VStack>
  );
};

export default Signup