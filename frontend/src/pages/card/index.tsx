import { useCallback } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { withLogin } from 'middlewares/withLogin';
import { selectCurrentUser, updateCurrentUser } from 'features/currentUser';
import { EditCard } from 'components/pages/EditCard';

const EditCardPage: NextPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const handlePublish = useCallback(
    ({ twitterScreenName, discordID }: { twitterScreenName?: string; discordID?: string }) => {
      dispatch(
        updateCurrentUser({
          twitterScreenName,
          discordId: discordID,
          cardPublished: true,
        }),
      );
    },
    [dispatch],
  );
  const handleUnpublish = useCallback(() => {
    dispatch(
      updateCurrentUser({
        cardPublished: false,
      }),
    );
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>会員証 | MISW Portal</title>
      </Head>
      <EditCard user={user} onPublish={handlePublish} onUnpublish={handleUnpublish} />
    </>
  );
};

export default withLogin(EditCardPage);
