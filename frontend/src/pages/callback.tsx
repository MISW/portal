import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Alert, Button, Typography } from '@mui/material';
import { useAuthCallback, useLogoutFromOIDC } from 'features/auth';

const Page: NextPage = () => {
  const {handleLogout} = useLogoutFromOIDC();
  const {handleCallback } = useAuthCallback();
  const [error, setError] = useState<string|null>(null);
  const [errorDescription, setErrorDescription] = useState<string|null>(null);

  useEffect(() => {

    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');
    const _error = params.get('error');
    const _errorDescription = params.get('error_description'); 

    if (code == null || state == null) {
      if(_error == null || _errorDescription == null){
        setError("unexpected error");
        setErrorDescription("There is no expected query parameter");
        //throw new Error('There is no expected query parameter');
      }else{
        setError(_error);
        setErrorDescription(_errorDescription);
      }
    }
    handleCallback(code as string, state as string);
  }, [handleCallback]);
  return (
    <>
      {
        error ?
          <>
             <Alert severity="error">
                <p>このアカウントではログインできません</p>
                <p>エラー: {error}</p>
                <p>説明: {errorDescription}</p>
                <Button onClick={handleLogout} variant="outlined" color="warning">
                  ログアウト
                </Button>
             </Alert>
          </>
          :<>
            <Typography>Loading...</Typography>
          </>
      }
      
    </>
  );
};

export default Page;
