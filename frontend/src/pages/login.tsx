import { useEffect } from 'react';
import { NextPage } from 'next';
import { useLogin } from 'features/auth';

const Page: NextPage = () => {
  const { login } = useLogin();
  useEffect(() => {
    login();
  }, [login]);
  return <>Trying Login...</>;
};

export default Page;
