import mysql, {Connection} from 'mysql2/promise';
import configConnect from "./configConnect";

let connection: Connection;

const mySql = {
    async init () {
        connection = await mysql.createConnection(configConnect.mysql)
    },
    getConnection() {
        return connection;
    }
}

export default mySql;