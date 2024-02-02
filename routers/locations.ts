import {Router} from "express";
import {Locations} from "../types";
import connectionMySql from "../serverMySQL";
import serverMySQL from "../serverMySQL";
import {RowDataPacket} from "mysql2";
import {categoriesRouter} from "./categories";

export const locationRouter = Router();

locationRouter.post('/', async (req, res, next) => {

    try {

        if (!req.body.location) {
            res.status(422).send({error: 'Location value is not to be an empty'});
        }

        const Locations: Locations = {
            location: req.body.location,
            description: req.body.description,
        }

        const [results, error] = await serverMySQL.getConnection().query(
            'INSERT INTO locations SET ?', Locations) as RowDataPacket[];

        if (error) {
            console.error('Error inserting locations:', error);
            res.status(500).send({error: 'Internal Server Error'});
        } else {
            const insertLocation = {...Locations, id: results.insertId};
            res.status(201).json(insertLocation);
        }

    } catch (e) {
        next(e);
    }
});

locationRouter.get('/', async (req, res) => {

    try {
        const [results] =
            await serverMySQL.getConnection().query('SELECT locations.id, locations.location, locations.description FROM locations;');
        res.status(200).json(results);
    } catch (error) {
        console.error('Error retrieving categories:', error);
        res.status(500).send({error: 'Internal Server Error'})
    }

});

locationRouter.get('/:id', async (req, res, next) => {

    try {

        const [results, error] =
            await serverMySQL.getConnection().query(
                'SELECT locations.id, locations.location, locations.description FROM locations WHERE locations.id = ?;',
                [req.params.id]) as RowDataPacket[];

        const location = results[0];

        if (!location) {
            return res.status(404).send({error: 'Category not found!'});
        }

        res.status(200).json(results);

        if (error) {
            console.error('Error retrieving location:', error);
            res.status(500).send({error: 'Internal server error'})
        }

    } catch (e) {
        return next(e);
    }

});

locationRouter.delete('/:id',   async(req, res, next) => {
    try {
        const [result, error] = await serverMySQL.getConnection().query(
            'DELETE FROM locations WHERE id = ? LIMIT 1;',
            [req.params.id]) as RowDataPacket[];

        if (result) {
            res.status(200).send({success: "Resource on location table was been deleted!"});
        } else {
            console.error('Error deleting location:', error);
            res.status(500).json({ error: 'Internal server error' });
        }

    } catch (e) {
        return next(e);
    }
});