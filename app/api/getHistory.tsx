// pages/api/fetchLYProject.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { db } = await connectToDatabase();

    const data = await db
        .collection('LYProject')
        .find({})
        .toArray(); // This will fetch all documents from the 'LYProject' collection

    res.status(200).json(data);
}
