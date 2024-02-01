import {Router} from "express";
import {Locations} from "../types";
import connectionMySql from "../serverMySQL";

export const locationRouter = Router();

locationRouter.post('/', (req, res, next) => {

    try {
        if (!req.body.location) {
            res.status(422).send({error: 'Location value is not to be an empty'});
        }

        const Locations: Locations = {
            location: req.body.location,
            description: req.body.description,
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

locationRouter.get('/', (req, res, next) => {

    try {
        connectionMySql.query('SELECT locations.id, locations.location, locations.description FROM locations;',
            (error, results) => {
            if (error) {
                console.error('Error retrieving locations:', error);
                res.status(500).send({ error: 'Internal Server Error' });
            } else {
                res.status(200).json(results);
            }
        });
    } catch (e) {
        return next(e);
    }

});

locationRouter.get('/:id',  (req, res, next) => {

    try {
        connectionMySql.query(
            'SELECT locations.id, locations.location, locations.description FROM locations WHERE locations.id = ?;',
            [req.params.id],
            (error, results) => {

                const location = results[0];

                if (!location) {
                    return  res.status(404).send({error: 'Location not found!'});
                }

                if (error) {
                    console.error('Error retrieving location:', error);
                    res.status(500).send({error: 'Internal server error'})
                } else {
                    res.status(200).json(results);
                }

            });
    } catch (e) {
        return next(e);
    }

});