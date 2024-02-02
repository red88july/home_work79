import {Router} from "express";
import connectionMySql from "../serverMySQL";
import {Items} from "../types";
import serverMySQL from "../serverMySQL";
import {RowDataPacket} from "mysql2";
import {locationRouter} from "./locations";

export const itemsRouter = Router();

itemsRouter.post('/', async (req, res, next) => {

    try {

        if (!req.body.item) {
            res.status(422).send({error: 'Item value is not to be an empty'});
        }

        const Items: Items = {
            category_id: req.body.category_id,
            location_id: req.body.location_id,
            item: req.body.item,
            description: req.body.description
        }

        const [results, error] = await serverMySQL.getConnection().query(
            'INSERT INTO items SET ?', Items) as RowDataPacket[];

        if (error) {
            console.error('Error inserting item:', error);
            res.status(500).send({error: 'Internal Server Error'});
        } else {
            const insertItem = {...Items, id: results.insertId};
            res.status(201).json(insertItem);
        }

    } catch (e) {
        next(e);
    }
});

itemsRouter.get('/', async (req, res) => {

    try {
        const [results] =
        await serverMySQL.getConnection().query(
                'SELECT i.id, i.item, c.categories category_name, l.location location_name, i.description FROM items i ' +
                'LEFT JOIN stocks.categories c on c.id = i.category_id LEFT JOIN stocks.locations l on l.id = i.location_id;',);

        res.status(200).json(results);

    } catch (error) {
        console.error('Error retrieving item:', error);
        res.status(500).send({error: 'Internal Server Error'})
    }
});

itemsRouter.get('/:id', async (req, res, next) => {

    try {

        const [results, error] =
            await serverMySQL.getConnection().query(
                'SELECT i.id, i.item, c.categories category_name, l.location location_name, i.description FROM items i ' +
                'LEFT JOIN stocks.categories c on c.id = i.category_id LEFT JOIN stocks.locations l on l.id = i.location_id ' +
                'WHERE i.id = ?;',
                [req.params.id],) as RowDataPacket[];

        const item = results[0];

        if (!item) {
            return res.status(404).send({error: 'Item not found!'});
        }
        res.status(200).json(results);

        if (error) {
            console.error('Error retrieving item:', error);
            res.status(500).send({error: 'Internal server error'})
        }

    } catch (e) {
        return next(e);
    }

});

itemsRouter.delete('/:id',   async(req, res, next) => {
    try {
        const [result,error] = await serverMySQL.getConnection().query(
            'DELETE FROM items WHERE id = ? LIMIT 1;',
            [req.params.id]) as RowDataPacket[];

        if (result) {
            res.status(200).send({success: "Resource on items table was been deleted!"});
        } else {
            console.error('Error deleting location:', error);
            res.status(500).json({ error: 'Internal server error' });
        }

    } catch (e) {
        return next(e);
    }
});