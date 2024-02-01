import {Router} from "express";
import {Categories} from "../types";
import connectionMySql from "../serverMySQL";

export const categoriesRouter = Router();

categoriesRouter.post('/', (req, res, next) => {

    try {
        if (!req.body.categories) {
            res.status(422).send({error: 'Categories value is not to be an empty'});
        }

        const Categories: Categories = {
            categories: req.body.categories,
            description: req.body.description,
        }

        connectionMySql.query('INSERT INTO categories SET ?', Categories, (error, results) => {
            if (error) {
                console.error('Error inserting category:', error);
                res.status(500).send({ error: 'Internal Server Error' });
            } else {
                const insertCategory = { ...Categories, id: results.insertId };
                res.status(201).json(insertCategory);
            }
        });

    } catch (e) {
        return next(e);
    }
});

categoriesRouter.get('/', (req, res, next) => {

    try {
        connectionMySql.query('SELECT categories.id, categories.categories, categories.description FROM categories;',
            (error, results) => {
            if (error) {
                console.error('Error retrieving categories:', error);
                res.status(500).send({ error: 'Internal Server Error' });
            } else {
                res.status(200).json(results);
            }
        });
    } catch (e) {
        next(e);
    }

});

categoriesRouter.get('/:id',  (req, res, next) => {

    try {
        connectionMySql.query(
            'SELECT categories.id, categories.categories, categories.description FROM categories WHERE categories.id = ?;',
            [req.params.id],
            (error, results) => {

                const categories = results[0];

                if (!categories) {
                    return  res.status(404).send({error: 'Category not found!'});
                }

                if (error) {
                    console.error('Error retrieving category:', error);
                    res.status(500).send({error: 'Internal server error'})
                } else {
                    res.status(200).json(results);
                }

            });
    } catch (e) {
        return next(e);
    }

});