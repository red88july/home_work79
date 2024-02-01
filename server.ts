import express from 'express';
import {categoriesRouter} from "./routers/categories";
import {locationRouter} from "./routers/locations";
import {itemsRouter} from "./routers/item";

const app = express();
const port = 8000;

app.use(express.json());
app.use('/categories', categoriesRouter);
app.use('/locations', locationRouter);
app.use('/items', itemsRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})