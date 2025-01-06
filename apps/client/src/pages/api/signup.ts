// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
// import { Admin } from "db";
import jwt from "jsonwebtoken";
// import { ensureDbConnected } from '@/lib/dbConnect';
const SECRET = "SECRET";
import prisma from 'db';

type Data = {
  token?: string;
  message?: string;
  name?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    console.log("handler called");
    // await ensureDbConnected()
    const { username, password } = req.body;
  // const admin = await Admin.findOne({ username });
  const admin = await prisma.admin.findFirst({
    where: {
    username
  }})
    if (admin) {
        res.status(403).json({ message: 'Admin already exists' });
    } else {
        const obj = { username: username, password: password };
      // const newAdmin = new Admin(obj);
      // newAdmin.save();
      const newAdmin = prisma.admin.create({
        data: obj})
        const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Admin created successfully', token });
    }    
}
