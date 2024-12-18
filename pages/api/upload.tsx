import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import { Readable } from 'stream';

// Configurer Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Configurer Prisma
const prisma = new PrismaClient();

// Désactiver le bodyParser natif de Next.js pour cette route
export const config = {
  api: {
    bodyParser: false,
  },
};

// Middleware pour gérer Multer
const multerUpload = multer({ storage: multer.memoryStorage() });
const runMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) return reject(result);
      resolve(result);
    });
  });
};

// Fonction principale
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      // Middleware Multer pour gérer l'upload
      await runMiddleware(req, res, multerUpload.single('file'));

      const file = (req as any).file;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      // Upload vers Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'uploads' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        Readable.from(file.buffer).pipe(uploadStream);
      });

      // Sauvegarder l'URL dans la base de données
      const savedImage = await prisma.image.create({
        data: { url: (result as any).secure_url },
      });

      res.status(200).json(savedImage);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  } else if (req.method === 'GET') {
    try {
      const images = await prisma.image.findMany({
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).json(images);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch images.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
};
