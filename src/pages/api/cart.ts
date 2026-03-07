import type { NextApiRequest, NextApiResponse } from "next";
import { mockCartData } from "@/data/mockData";
import { CartData } from "@/types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CartData>
) {
  setTimeout(() => {
    res.status(200).json(mockCartData);
  }, 100);
}
