import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useToast, Input, Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Button, 
CircularProgress} from '@chakra-ui/react';
import TownsServiceClient from '../../../classes/TownsServiceClient';
import { useAppState } from '../../VideoCall/VideoFrontend/state/index';

export default function SignIn() : JSX.Element{
  const { setSignedIn } = useAppState();
  const { email, setEmail, setAvatar } = useAppState();
  const [password, setPassword] = useState('');
  const [error] = useState('');
  const [isLoading] = useState(false);
  const history = useHistory();
  const toast = useToast();
  const apiClient = new TownsServiceClient();

  const handleSubmit = async () => {
    const response = await apiClient.handleLoginSubmit({ email, password });
    if (response.isSuccess === true) {
      
      const myavatar = await apiClient.getAvatarForUser({ email });
      // console.log(`Avatar for this user ${myavatar.avatar}`);
      setAvatar(myavatar.avatar);
      setSignedIn(true);
      // console.log(`Signed In ${isSignedIn}`);
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
  <>
    <Flex width='Full' align='center' justifyContent='center'>
      <Box p={8} maxWidth='500px' borderWidth={1} borderRadius={8} boxShadow='lg'>
        <Box textAlign='center'>
          <Heading> Sign In </Heading>
        </Box>
        <Box my={4} textAlign='left'>
          <form
            onSubmit={ev => {
              ev.preventDefault();
              handleSubmit();
            }}>
            {error}
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
            <Button colorScheme='teal' variant='outline' width='full' mt={4} type='submit'>
              {isLoading ? (
                <CircularProgress isIndeterminate size='24px' color='teal' />
              ) : (
                'Sign In'
              )}
            </Button>
            <Link to='/'>
              <Button colorScheme='teal' variant='outline' width='full' mt={4} type='submit'>
                Back
              </Button>
            </Link>
          </form>
        </Box>
      </Box>
    </Flex>
    </>
  );
}
