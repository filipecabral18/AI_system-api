import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { openai } from '../lib/openAI';

export async function generateAICompletionRoute(app: FastifyInstance) {
  app.post('/ai/complete', async (req, resp) => {
    const bodySchema = z.object({
      videoId: z.uuid(),
      template: z.string(),
      temperature: z.number().min(0).max(1).default(0.5),
    });

    const { videoId, template, temperature } = bodySchema.parse(req.body);

    const video = await prisma.video.findUniqueOrThrow({
      where: { id: videoId },
    });

    if (!video.transcription) {
      return resp.status(400).send({ error: 'Video transcription not found.' });
    }

    const promptMessage = template.replace(
      '{transcription}',
      video.transcription
    );

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature,
      messages: [{ role: 'user', content: promptMessage }],
      stream: true,
    });

    return response;
  });
}
