import {Router} from "express";
import connectionMySql from "../serverMySQL";
import {Items} from "../types";

export const itemsRouter = Router();

itemsRouter.post('/', (req, res, next) => {

    try {
        if (!req.body.item) {
            res.status(422).send({error: 'Item value is not to be an empty'});
        }

        const Items: Items = {
            category_id: req.body.category_id,
            location_id: req.body.location_id,
            item: req.body.item,
            description: req.body.description,
        }

        connectionMySql.query('INSERT INTO items SET ?', Items, (error, results) => {
            if (error) {
                console.error('Error inserting items:', error);
                res.status(500).send({error: 'Internal Server Error'});
            } else {
                const insertedItems = {...Items, id: results.insertId};
                res.status(201).json(insertedItems);
            }
        });

    } catch (e) {
        next(e);
    }
});

itemsRouter.get('/',  (req, res, next) => {

    try {
        connectionMySql.query(
            'SELECT i.id, i.item, c.categories category_name, l.location location_name, i.description FROM items i ' +
            'LEFT JOIN stocks.categories c on c.id = i.category_id LEFT JOIN stocks.locations l on l.id = i.location_id;',
            (error, results) => {
                if (error) {
                    console.error('Error retrieving items:', error);
                    res.status(500).send({error: 'Internal server error'})
                } else {
                    res.status(200).json(results);
                }
            });
    } catch (e) {
       return next(e);
    }

});

itemsRouter.get('/:id',  (req, res, next) => {

    try {
        connectionMySql.query(
            'SELECT i.id, i.item, c.categories category_name, l.location location_name, i.description FROM items i ' +
            'LEFT JOIN stocks.categories c on c.id = i.category_id LEFT JOIN stocks.locations l on l.id = i.location_id ' +
            'WHERE i.id = ?;',
            [req.params.id],
            (error, results) => {

                const item = results[0];

                if (!item) {
                    return  res.status(404).send({error: 'Not Found!'});
                }

                if (error) {
                    console.error('Error retrieving items:', error);
                    res.status(500).send({error: 'Internal server error'})
                } else {
                    res.status(200).json(results);
                }

            });
    } catch (e) {
        return next(e);
    }

});