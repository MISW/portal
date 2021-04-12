import type { NextApiHandler } from "next";

const cardImageHandler: NextApiHandler = async (req, res) => {
  const { id } = req.query;
  if (Array.isArray(id)) throw new Error('"id" must be string');
  res.status(200).json({ id });
};

export default cardImageHandler;
