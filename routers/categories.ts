import {Router} from "express";
import mysql from 'mysql';
import {Categories} from "../types";

export const categoriesRouter = Router();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'stocks',
    port: 3306
});

connection.connect((error) => {
    if (error) {
        console.error(`Error connecting to MySQL:`, error);
    } else {
        console.log(`Connecting to MySQL`);
    }
})

categoriesRouter.post('/', (req, res, next) => {

    try {
        if (!req.body.name) {
            res.status(422).send({error: 'Categories value is not to be an empty'});
        }

        const Categories: Categories = {
            name: req.body.name,
            description: req.body.description,
        }

        connection.query('INSERT INTO categories SET ?', Categories, (error, results) => {
            if (error) {
                console.error('Error inserting category:', error);
                res.status(500).send({ error: 'Internal Server Error' });
            } else {
                const insertedCategory = { ...Categories, id: results.insertId };
                res.status(201).json(insertedCategory);
            }
        });

    } catch (e) {
        next(e);
    }
});