import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  CircularProgress,
} from '@chakra-ui/core';
import { useToast } from '@chakra-ui/react';
import TownsServiceClient from '../../../classes/TownsServiceClient';
import ErrorMessage from '../ErrorMessage';
import { useAppState } from '../../VideoCall/VideoFrontend/state';


export default function SignIn() {
  const {isSignedIn, setSignedIn} = useAppState();
  const {email , setEmail} = useAppState();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const toast = useToast();
  const apiClient = new TownsServiceClient();

  const handleSubmit = async () => {
    const response = await apiClient.handleLoginSubmit({ email, password });
    if (response.isSuccess === true) {
      setSignedIn(true);
      history.replace('/');
      toast({
        title: `Welcome ${response.name}`,
        description: 'Welcome to your profile',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } else {
      setSignedIn(false);
      alert('Invalid Credentials');
      toast({
        title: 'Invalid Credentials',
        description: 'Check the Username and the Password',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex width='Full' align='center' justifyContent='center'>
      <Box p={8} maxWidth='500px' borderWidth={1} borderRadius={8} boxShadow='lg'>
        <Box textAlign='center'>
          <Heading> Sign In </Heading>
        </Box>
        <Box my={4} textAlign='left'>
          <form onSubmit={handleSubmit}>
            {error && <ErrorMessage />}
            <FormControl isRequired>
              <FormLabel> Email </FormLabel>
              <Input
                type='email'
                placeholder='test@test.com'
                size='lg'
                onChange={event => setEmail(event.currentTarget.value)}
              />
            </FormControl>
            <FormControl isRequired mt={6}>
              <FormLabel> Password </FormLabel>
              <Input
                type='password'
                placeholder='********'
                size='lg'
                onChange={event => setPassword(event.currentTarget.value)}
              />
            </FormControl>
            <Button variantColor='teal' variant='outline' width='full' mt={4} type='submit'>
              {isLoading ? (
                <CircularProgress isIndeterminate size='24px' color='teal' />
              ) : (
                'Sign In'
              )}
            </Button>
            <Link to='/'>
              <Button variantColor='teal' variant='outline' width='full' mt={4} type='submit'>
                Back
              </Button>
            </Link>
          </form>
        </Box>
      </Box>
    </Flex>
  );
}
