import type { NextApiHandler } from 'next';
import fs from 'fs';
import utils from 'util';
import type { Card } from 'models/card';
import ReactDOM from 'react-dom/server';
import sharp from 'sharp';
import { CardSvg } from 'components/CardSvg';
import { createApiClient } from 'infra/api';
import miswlogo from 'assets/mislogo.png';

const client = createApiClient(process.env.BACKEND_HOST ?? '');

const getIdAndExtFromRawId = (rawId: string) => {
  const matched = /\.([a-z]+)$/.exec(rawId);
  if (matched == null)
    return {
      id: rawId,
      ext: 'png',
    } as const;

  const [, ext] = matched;
  return {
    id: rawId.slice(0, rawId.length - 1 - ext.length),
    ext: ext.toLowerCase(),
  } as const;
};

const fetchAsDataURL = async (input: RequestInfo) => {
  const res = await fetch(input);
  const contentType = res.headers.get('content-type') ?? 'text/html';
  const buf = await res.arrayBuffer().then((ab) => Buffer.from(ab));
  return `data:${contentType};base64,${buf.toString('base64')}`;
};

const loadAssetAsDataURL = async (assetPath: string, contentType: string) => {
  if (!assetPath.startsWith('/_next')) {
    throw new Error(`"${assetPath}" is not asset path of Next.js`);
  }
  const path = assetPath.replace(/^\/_next/, '.next');
  const buf = await utils.promisify(fs.readFile)(path);
  return `data:${contentType};base64,${buf.toString('base64')}`;
};

const cardImageHandler: NextApiHandler = async (req, res) => {
  const { id: rawId } = req.query;
  if (Array.isArray(rawId)) throw new Error('"id" must be string');

  const { id: idStr, ext } = getIdAndExtFromRawId(rawId);

  const id = parseInt(idStr, 10);
  if (Number.isNaN(id)) {
    res.status(400).end('Invalid ID');
    return;
  }

  let card: Card;
  try {
    card = await client.fetchCard(id);
  } catch (e) {
    res.status(404).end('card not found');
    return;
  }

  const avatarUrlPromise = card.avatar != null ? fetchAsDataURL(card.avatar.url).catch(() => undefined) : Promise.resolve(undefined);

  const miswLogoUrlPromise = loadAssetAsDataURL(miswlogo.src, 'image/png');

  const [avatarUrl, miswLogoUrl] = await Promise.all([avatarUrlPromise, miswLogoUrlPromise]);

  const svg = ReactDOM.renderToStaticMarkup(
    <CardSvg
      width="1200"
      height="630"
      avatarUrl={avatarUrl}
      miswLogoUrl={miswLogoUrl}
      generation={card.generation}
      handle={card.handle}
      workshops={card.workshops}
      squads={card.squads}
      twitterScreenName={card.twitterScreenName}
      discordId={card.discordID}
    />,
  );

  if (ext === 'svg') {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).end(svg);
    return;
  }

  try {
    const image = sharp(Buffer.from(svg));

    if (ext === 'jpg' || ext === 'jpeg') {
      res.setHeader('Content-Type', 'image/jpeg');
      const buf = await image.jpeg().toBuffer();
      res.status(200).end(buf);
      return;
    }

    if (ext === 'webp') {
      res.setHeader('Content-Type', 'image/webp');
      const buf = await image.webp().toBuffer();
      res.status(200).end(buf);
      return;
    }

    res.setHeader('Content-Type', 'image/png');
    const buf = await sharp(Buffer.from(svg)).png().toBuffer();
    res.status(200).end(buf);
  } catch (e) {
    console.error(e);
    res.status(500).end('Failed to render SVG');
  }
};

export default cardImageHandler;
