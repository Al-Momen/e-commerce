import express from 'express';
const app = express();



app.get('/', (req, res) => {
  res.send('Hello World from Node.js!');
});

export default app;
