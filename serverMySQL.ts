import mysql from 'mysql';

const connectionMySql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'stocks',
    port: 3306
});

connectionMySql.connect((error) => {

    if (error) {
        console.error(`Error connecting to MySQL:`, error);
    } else {
        console.log(`Connecting to MySQL DB`);
    }
})

export default connectionMySql;