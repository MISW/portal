import type { NextApiHandler } from "next";
import React from "react";
import ReactDOM from "react-dom/server";
import sharp from "sharp";

const Svg = () => (
  <svg
    version="1.1"
    baseProfile="full"
    width="300"
    height="200"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="100%" height="100%" fill="red" />
    <circle cx="150" cy="100" r="80" fill="green" />
    <text x="150" y="125" fontSize="60" textAnchor="middle" fill="white">
      SVG
    </text>
  </svg>
);

const cardImageHandler: NextApiHandler = async (req, res) => {
  const { id } = req.query;
  if (Array.isArray(id)) throw new Error('"id" must be string');
  const svg = ReactDOM.renderToStaticMarkup(<Svg />);
  res.setHeader("Content-Type", "image/png");
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  res.status(200).end(buf);
};

export default cardImageHandler;
