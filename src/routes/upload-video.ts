import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import fastifyMultipart from '@fastify/multipart';
import { randomUUID } from 'crypto';
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import path from 'path';

const pump = promisify(pipeline);

export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 50 * 1024 * 1024, // 50 MB
    },
  });
  app.post('/videos', async (request, response) => {
    const data = await request.file();

    if (!data) {
      return response.status(400).send({ error: 'No file uploaded' });
    }

    const extension = path.extname(data.filename);

    if ('.mp3' !== extension) {
      return response.status(400).send({ error: 'Invalid file type.' });
    }

    const fileBaseName = path.basename(data.filename, extension);
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`;

    const uploadPath = path.resolve(__dirname, '../../tmp', fileUploadName);
    await pump(data.file, fs.createWriteStream(uploadPath));

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadPath,
      },
    });

    return { video };
  });
}
