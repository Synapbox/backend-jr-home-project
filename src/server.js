import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 5050);

createApp().listen(port, () => {
  console.log(`Survey metrics API listening on http://localhost:${port}`);
});
