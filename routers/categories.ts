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

// categoriesRouter.delete('/:id',   async(req, res, next) => {
//     const paramsID = req.params.id
//
//     try {
//        // const checkId = connectionMySql.query('SELECT * FROM items WHERE items.category_id = ?;',[paramsID]);
//        //
//        // if (checkId.length > 0) {
//        //     return res.status(400).json({error: 'Cannot deleted with associated id!'})
//        //  }
//         const [checkIdResult] = await connectionMySql.query(
//             'SELECT * FROM items WHERE items.category_id = ?;',
//             [paramsID]
//         );
//
//         if (checkIdResult.length > 0) {
//             return res.status(400).json({ error: 'Cannot delete with associated id!' });
//         }
//         connectionMySql.query(
//             'DELETE FROM categories WHERE id = ? LIMIT 1;',
//             [req.params.id],
//              (error) => {
//                 if (error) {
//                     console.error('Error deleting category:', error);
//                  res.status(500).send({error: 'Internal server error'})
//                 } else {
//                  res.status(200).send({success: "Resource was been deleted!"});
//                 }
//             });
//     } catch (e) {
//         return next(e);
//     }
//
// });