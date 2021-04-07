import { Button } from '@chakra-ui/core';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TownJoinResponse } from '../../classes/TownsServiceClient';
import MediaErrorSnackbar from '../VideoCall/VideoFrontend/components/PreJoinScreens/MediaErrorSnackbar/MediaErrorSnackbar';
import PreJoinScreens from '../VideoCall/VideoFrontend/components/PreJoinScreens/PreJoinScreens';

interface LoginProps {
  doLogin: (initData: TownJoinResponse) => Promise<boolean>;
}

export default function Login({ doLogin }: LoginProps): JSX.Element {
  const [mediaError, setMediaError] = useState<Error>();
  const history = useHistory();
  const onClickSignIn = () => history.push('/signin');
  const onClickSignUp = () => history.push('/signup');
  return (
    <>
      <MediaErrorSnackbar error={mediaError} dismissError={() => setMediaError(undefined)} />
      <Button mt={2} onClick={onClickSignIn}>
        Sign In
      </Button>
      &nbsp;
      <Button mt={2} onClick={onClickSignUp}>
        Sign up
      </Button>
      <PreJoinScreens doLogin={doLogin} setMediaError={setMediaError} />
    </>
  );
}
