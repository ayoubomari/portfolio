const express = require("express");
const next = require("next");
const { parse } = require("url");
const cors = require("cors"); // Import the CORS package

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3003;

app.prepare().then(() => {
  const server = express();

  // Enable CORS for all routes
  server.use(cors());

  // Middleware to force HTTPS
  server.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https" && !dev) {
      // Redirect to HTTPS
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });

  // Serve static files from the 'public' directory
  server.use(express.static("public"));

  server.all("*", (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
