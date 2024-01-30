import express from 'express';

const app = express();
const port = 8000;

app.use(express.json());

app.post('/stock', (req, res, next) => {
   res.send('This is a post request');
});

app.get('/stock', (req, res, next) => {
    res.send(`This is a get request`);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})