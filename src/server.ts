import { fastify } from 'fastify';
import { getAllPromptsRoute } from './routes/get-all-prompts';
const app = fastify();

app.register(getAllPromptsRoute);

app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running at ${address}`);
});
