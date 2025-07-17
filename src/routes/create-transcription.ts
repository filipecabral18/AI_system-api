import { FastifyInstance } from 'fastify';
import { z } from 'zod';

export async function createTranscriptionRoute(app: FastifyInstance) {
  app.post('/videos/:videoId/transcription', async (req) => {
    const paramSchema = z.object({
      videoId: z.uuid(),
    });

    const { videoId } = paramSchema.parse(req.params);

    const bodySchema = z.object({
      prompt: z.string(),
    });

    const { prompt } = bodySchema.parse(req.body);

    return {
      videoId,
      prompt,
    };
  });
}
