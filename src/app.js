import express from "express";

// Starter app. Restructure it however you like: this file is a starting point,
// not a required layout. Only the HTTP contract described in README.md is fixed.
export function createApp() {
  const app = express();
  app.use(express.json({ limit: "2mb" }));

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // TODO: your routes go here.

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Unexpected error" } });
  });

  return app;
}
