import { createServer, preview } from "vite";

const port = Number(process.env.PORT);

if (port) {
  await preview({
    preview: {
      host: "0.0.0.0",
      port,
      strictPort: true,
    },
  });
} else {
  const server = await createServer();
  await server.listen();
  server.printUrls();
}
