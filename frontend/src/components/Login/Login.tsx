import React, { useState } from 'react';
import {BrowserRouter as Router, Switch, Route, useHistory, Link  } from 'react-router-dom';
import { Button } from '@material-ui/core';
import PreJoinScreens from '../VideoCall/VideoFrontend/components/PreJoinScreens/PreJoinScreens';
import MediaErrorSnackbar
  from '../VideoCall/VideoFrontend/components/PreJoinScreens/MediaErrorSnackbar/MediaErrorSnackbar';
import { TownJoinResponse } from '../../classes/TownsServiceClient';


interface LoginProps {
  doLogin: (initData: TownJoinResponse) => Promise<boolean>
}

export default function Login({ doLogin }: LoginProps): JSX.Element {
  const [mediaError, setMediaError] = useState<Error>();
  const history = useHistory();
  const onClickSignIn = () => history.push("/signin");  
  const onClickSignUp = () => history.push("/signup");
  return (
    <>
      <MediaErrorSnackbar error={mediaError} dismissError={() => setMediaError(undefined)} />
      <Button onClick = {onClickSignIn}> Sign In</Button>
      <Button onClick = {onClickSignUp}> Sign up</Button>
      <PreJoinScreens
        doLogin={doLogin}
        setMediaError={setMediaError}
      />
    </>
  );
}
