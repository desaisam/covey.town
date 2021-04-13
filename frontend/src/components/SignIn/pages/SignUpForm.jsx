import React, { useState } from 'react';
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

import { Link , useHistory} from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import ErrorMessage from '../ErrorMessage';
import TownsServiceClient from '../../../classes/TownsServiceClient';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const apiClient = new TownsServiceClient();
  const toast = useToast();
  const history = useHistory();

  const handleSubmit = async () => {
    console.log(`Correctly Clicked Handle Submit Button`);
    console.log(`Api CLient ${apiClient}`);
    const response = await apiClient.handleRegisterSubmit({ name, email, password });
    console.log(`Response back to signup ${response.isSuccess}`);
    console.log(`Response back to signup ${response.message}`);
    
    if (response.isSuccess === true) {
      alert(`Success`);
      history.replace('/');
      toast({
        title: `Sign up for ${response.name} successful`,
        description: 'Sign in to your profile',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } else {
      alert('Invalid Credentials');
      toast({
        title: 'Sign up failed!',
        description: 'Check the details entered',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      setEmail('');
      setPassword('');
    }
  };

  return (
    <Flex width='Full' align='center' justifyContent='center'>
      <Box p={8} maxWidth='500px' borderWidth={1} borderRadius={8} boxShadow='lg'>
        <Box textAlign='center'>
          <Heading> Sign Up </Heading>
        </Box>
        <Box my={4} textAlign='left'>
          <form onSubmit={(ev)=>{ev.preventDefault(); handleSubmit()}}>
            {error && <ErrorMessage />}
            <FormControl isRequired>
              <FormLabel> Name </FormLabel>
              <Input
                placeholder='Enter Name'
                size='lg'
                onChange={event => setName(event.currentTarget.value)}
              />
            </FormControl>
            <br />
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
                'Sign Up'
              )}
            </Button>
            <Link to='/'>
              <Button variantColor='teal' variant='outline' width='full' mt={4} type='submit'>
                {isLoading ? <CircularProgress isIndeterminate size='24px' color='teal' /> : 'Back'}
              </Button>
            </Link>
          </form>
        </Box>
      </Box>
    </Flex>
  );
}
