const express = require("express");
const next = require("next");
const { parse } = require("url");
const { join } = require("path");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  // Serve static files from the 'public' directory
  server.use(express.static("public"));

  // Handle file uploads to the 'public/images' directory
  server.use("/upload", express.static(join(__dirname, "public", "images")));

  server.all("*", (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
