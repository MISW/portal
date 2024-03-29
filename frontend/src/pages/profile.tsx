import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NextPage } from 'next';
import Router from 'next/router';
import Profile from 'components/layout/Profile';
import PaymentStatuses from 'components/layout/PaymentStatuses';
import { Box } from '@mui/material';
import { selectCurrentUser, selectCurrentPaymentStatuses, fetchCurrentPaymentStatuses } from 'features/currentUser';
import { nonNullOrThrow } from 'utils';
import { NoSSR } from 'components/utils/NoSSR';
import { withLoginUser } from 'middlewares/withLoginUser';
import { AppDispatch } from 'store/store';

const Page: NextPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = nonNullOrThrow(useSelector(selectCurrentUser));
  const paymentStatuses = useSelector(selectCurrentPaymentStatuses);
  useEffect(() => {
    dispatch(fetchCurrentPaymentStatuses());
  }, [dispatch]);

  return (
    <NoSSR>
      <Profile user={currentUser} editButton={true} handleEditButton={() => Router.push('/profile/update')} />
      <Box mt={6}>{paymentStatuses != null && <PaymentStatuses paymentStatuses={paymentStatuses} editButton={false} />}</Box>
    </NoSSR>
  );
};

export default withLoginUser(Page);
