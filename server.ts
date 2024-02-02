import express from 'express';
import {categoriesRouter} from "./routers/categories";
import {locationRouter} from "./routers/locations";
import {itemsRouter} from "./routers/item";
import serverMySQL from "./serverMySQL";

const app = express();
const port = 8000;

app.use(express.json());
app.use('/categories', categoriesRouter);
app.use('/locations', locationRouter);
app.use('/items', itemsRouter);

const run = async () => {
    await serverMySQL.init();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
};

void run();