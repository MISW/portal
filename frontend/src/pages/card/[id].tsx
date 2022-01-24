import React, { useEffect } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import type { Card } from 'models/card';
import { createApiClient } from 'infra/api';
import { selectCurrentUser } from 'features/currentUser';
import { CardSvg } from 'components/CardSvg';
import miswlogo from 'assets/mislogo.png';

const numberPostfix = (num: number) => {
  if (num % 10 === 1) return 'st';
  if (num % 10 === 2) return 'nd';
  if (num % 10 === 3) return 'rd';
  return 'th';
};

type CardPageProps = {
  readonly card: Card;
  readonly baseURL: string;
};

const CardPage: NextPage<CardPageProps> = ({ card, baseURL }) => {
  const router = useRouter();
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    if (card.id === user?.id) {
      router.push('/card');
    }
  }, [router, card, user]);

  const gen = card.generation;

  const title = `${gen}${numberPostfix(gen)} ${card.handle}`;
  const description = `研究会: ${card.workshops.join(
    ',',
  )} 班: ${card.squads.join(',')}`;
  const pageURL = new URL(`/card/${card.id}`, baseURL).href;
  const imageURL = new URL(`/card-image/${card.id}.png`, baseURL).href;

  return (
    <>
      <Head>
        <title>{title} | MISW Portal</title>
        <meta property="og:url" content={pageURL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageURL} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:image" content={imageURL} />
        <meta property="twitter:site" content="@misw_info" />
      </Head>
      <div className="mx-auto mt-8 w-full max-w-screen-md">
        <div className="border-2 border-gray-600">
          <CardSvg
            width="100%"
            avatarUrl={card.avatar?.url}
            miswLogoUrl={miswlogo.src}
            generation={card.generation}
            handle={card.handle}
            workshops={card.workshops}
            squads={card.squads}
            twitterScreenName={card.twitterScreenName}
            discordId={card.discordID}
          />
        </div>
      </div>
    </>
  );
};

export default CardPage;

export const getServerSideProps: GetServerSideProps<CardPageProps> = async (
  ctx,
) => {
  const idRaw = ctx.params?.id;

  if (idRaw == null || Array.isArray(idRaw) || !/^\d{1,10}$/.test(idRaw)) {
    return { notFound: true };
  }

  const id = Number.parseInt(idRaw, 10);

  const card = await createApiClient(process.env.BACKEND_HOST ?? '')
    .fetchCard(id)
    .catch((e) => {
      console.error(e);
      return undefined;
    });

  if (card == null) {
    return { notFound: true };
  }

  return {
    props: { card, baseURL: process.env.BASE_URL ?? '' },
  };
};
