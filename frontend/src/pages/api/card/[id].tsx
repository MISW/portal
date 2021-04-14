import type { NextApiHandler } from "next";
import React from "react";
import ReactDOM from "react-dom/server";
import sharp from "sharp";
import { CardSvg } from "components/CardSvg";

const avatar = "https://example.com/avatar.png";

const getIdAndExtFromRawId = (rawId: string) => {
  const matched = /\.([a-z]+)$/.exec(rawId);
  if (matched == null) return { id: rawId, ext: "png" } as const;

  const [, ext] = matched;
  return {
    id: rawId.slice(0, rawId.length - 1 - ext.length),
    ext: ext.toLowerCase(),
  } as const;
};

const fetchAsDataURL = async (input: RequestInfo) => {
  const res = await fetch(input);
  const contentType = res.headers.get("content-type") ?? "text/html";
  const buf = await res.arrayBuffer().then((ab) => Buffer.from(ab));
  return `data:${contentType};base64,${buf.toString("base64")}`;
};

const cardImageHandler: NextApiHandler = async (req, res) => {
  const { id: rawId } = req.query;
  if (Array.isArray(rawId)) throw new Error('"id" must be string');

  const { id, ext } = getIdAndExtFromRawId(rawId);

  const avatarUrl = await fetchAsDataURL(avatar).catch(() => undefined);

  const svg = ReactDOM.renderToStaticMarkup(
    <CardSvg
      avatarUrl={avatarUrl}
      generation={99}
      handle="tosuke"
      workshops={[]}
      squads={[]}
    />
  );

  if (ext === "svg") {
    res.setHeader("Content-Type", "image/svg+xml");
    res.status(200).end(svg);
    return;
  }

  try {
    const image = sharp(Buffer.from(svg));

    if (ext === "jpg" || ext === "jpeg") {
      res.setHeader("Content-Type", "image/jpeg");
      const buf = await image.jpeg().toBuffer();
      res.status(200).end(buf);
      return;
    }

    if (ext === "webp") {
      res.setHeader("Content-Type", "image/webp");
      const buf = await image.webp().toBuffer();
      res.status(200).end(buf);
      return;
    }

    res.setHeader("Content-Type", "image/png");
    const buf = await sharp(Buffer.from(svg)).png().toBuffer();
    res.status(200).end(buf);
  } catch (e) {
    console.error(e);
    res.status(500).end("Failed to render SVG");
  }
};

export default cardImageHandler;
