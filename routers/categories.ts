import serverMySQL from "../serverMySQL";
import {RowDataPacket} from "mysql2";
import {Router} from "express";
import {Categories} from "../types";

export const categoriesRouter = Router();

categoriesRouter.post('/', async (req, res, next) => {

    try {
        if (!req.body.categories) {
            res.status(422).send({error: 'Categories value is not to be an empty'});
        }
        const Categories: Categories = {
            categories: req.body.categories,
            description: req.body.description,
        }

        const [results, error] = await serverMySQL.getConnection().query(
            'INSERT INTO categories SET ?', Categories) as RowDataPacket[];

        if (error) {
            console.error('Error inserting category:', error);
            res.status(500).send({error: 'Internal Server Error'});
        } else {
            const insertCategory = {...Categories, id: results.insertId};
            res.status(201).json(insertCategory);
        }

    } catch (e) {
        return next(e);
    }
});

categoriesRouter.get('/', async (req, res) => {

    try {
        const [results] =
        await serverMySQL.getConnection().query(
            'SELECT categories.id, categories.categories, categories.description FROM categories');
        res.status(200).json(results);
    } catch (error) {
        console.error('Error retrieving categories:', error);
        res.status(500).send({error: 'Internal Server Error'})
    }

});

categoriesRouter.get('/:id', async (req, res, next) => {

    try {
        const [results, error] =
            await serverMySQL.getConnection().query(
                'SELECT categories.id, categories.categories, categories.description FROM categories WHERE categories.id = ?',
                [req.params.id]) as RowDataPacket[];

        const categories = results[0];

        if (!categories) {
            return res.status(404).send({error: 'Category not found!'});
        }

        res.status(200).json(results);

        if (error) {
            console.error('Error retrieving category:', error);
            res.status(500).send({error: 'Internal server error'})
        }

    } catch (e) {
        return next(e);
    }

});

categoriesRouter.delete('/:id',   async(req, res, next) => {
    try {
        const [result, error] = await serverMySQL.getConnection().query(
            'DELETE FROM categories WHERE id = ? LIMIT 1;',
            [req.params.id]) as RowDataPacket[];

        if (result) {
            res.status(200).send({success: "Resource on category table was been deleted!"});
        } else {
            console.error('Error deleting category:', error);
            res.status(500).json({ error: 'Internal server error' });
        }

    } catch (e) {
        return next(e);
    }
});