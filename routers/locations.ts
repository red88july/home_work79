import {Router} from "express";
import {Location} from "../types";
import connectionMySql from "../serverMySQL";

export const locationRouter = Router();

locationRouter.post('/', (req, res, next) => {

    try {
        if (!req.body.locations) {
            res.status(422).send({error: 'Location value is not to be an empty'});
        }

        const Locations: Location = {
            locations: req.body.locations,
            description: null,
        }

        connectionMySql.query('INSERT INTO locations SET ?', Locations, (error, results) => {
            if (error) {
                console.error('Error inserting locations:', error);
                res.status(500).send({ error: 'Internal Server Error' });
            } else {
                const insertedlocations = { ...Locations, id: results.insertId };
                res.status(201).json(insertedlocations);
            }
        });

    } catch (e) {
        next(e);
    }
});