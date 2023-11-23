const pg = require('pg');

const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json());


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// here, i want to insert a new user
// meaning that i'll get their id and for now, i'll put tickets as 0
// bc we start out with 0 tickets
async function insertIntoDatabase(name) {
    //create client
    const client = new pg.Client({
        //if you want the following to work on your own computer
        //replace the fields with your information
        user: 'postgres',
        database: 'postgres',
        password: 'strokeseat', 
        port: 5432,
    });

    //connect client
    await client.connect();

    console.log(name);

    const tableName = 'users';
    const queryText = 'INSERT INTO ' + tableName + ' (user_id, user_tickets) VALUES ($1, $2)';
    const values = [name, 0];

    const res = await client.query(queryText, values);
    console.log(res);
    
    //close connection
    await client.end();

    return res;
}

async function getTixFromDatabase(name) {
    //create client
    const client = new pg.Client({
        //if you want the following to work on your own computer
        //replace the fields with your information
        user: 'postgres',
        database: 'postgres',
        password: 'strokeseat', 
        port: 5432,
    });
    
    //connect client
    await client.connect();
    const tableName = 'users';
    const queryText = 'SELECT * FROM ' + tableName + ' WHERE user_id = \'' + name + '\';';

    const res = await client.query(queryText);
    
    //close connection
    await client.end();

    return res;
}

async function updateTixDatabase(name) {
        //create client
        const client = new pg.Client({
            //if you want the following to work on your own computer
            //replace the fields with your information
            user: 'postgres',
            database: 'postgres',
            password: 'strokeseat', 
            port: 5432,
        });
    
        //connect client
        await client.connect();
    
        const tableName = 'users';
        const queryText = 'UPDATE ' + tableName + ' SET user_tickets = user_tickets + 1 WHERE user_id = \'' + name + '\';';
    
        const res = await client.query(queryText);
        console.log(res);
        
        //close connection
        await client.end();
    
        return res;    
}

async function getUserFromDatabase(num) {
        //create client
        const client = new pg.Client({
            //if you want the following to work on your own computer
            //replace the fields with your information
            user: 'postgres',
            database: 'postgres',
            password: 'strokeseat', 
            port: 5432,
        });
    
        //connect client
        await client.connect();
    
        const tableName = 'users';
        //const dec = num - 1;
        const queryText = 'SELECT * FROM ' + tableName + ' WHERE user_tickets > 0 ORDER BY user_tickets OFFSET ' + num + ' LIMIT 1;';
    
        const res = await client.query(queryText);
        console.log(res);
        
        //close connection
        await client.end();
    
        return res;
}

async function getSizeDatabase() {
    //create client
    const client = new pg.Client({
        //if you want the following to work on your own computer
        //replace the fields with your information
        user: 'postgres',
        database: 'postgres',
        password: 'strokeseat', 
        port: 5432,
    });

    //connect client
    await client.connect();

    const tableName = 'users';
    const queryText = 'SELECT COUNT(*) AS row_count FROM ' + tableName + ' WHERE user_tickets > 0;';

    const res = await client.query(queryText);
    console.log(res);
    
    //close connection
    await client.end();

    return parseInt(res.rows[0].row_count, 10);
}

app.get('', async (req, res) => {
    const nameCards = await getAllFromDatabase();
    res.send(nameCards);
})

// WHAT DOES ASYNC DO?? apparently just asynchronous function

// this is both to get the num of tickets
// as well as checking whether they are a valid user
app.get('/login', async (req, res) => {
    const tix = await getTixFromDatabase(req.query.username);
    res.send(tix);
})

// we want this to get the winner
app.get('/winner', async (req, res) => {
    const totalValid = await getSizeDatabase();
    console.log('SIZE: ' + totalValid);
    let index = Math.floor(Math.random() * totalValid);
    console.log('INDEX: ' + index);

    const winner = await getUserFromDatabase(index);
    //call database function

    res.send(winner);
})

app.get('/inctix', async (req, res) => {
    const done = await updateTixDatabase(req.query.username);
    const tix = await getTixFromDatabase(req.query.username);
    res.send(tix.user_tickets);
})

app.post('/newuser', async (req, res) => {
    
    const response = await insertIntoDatabase(req.body.id);
    res.send(response);

})

const port = 3256
const host = 'localhost'
app.listen(port, host, () => {
    console.log(`Example app listening on port ${port}`)
})

/*
To run -->  node index.js
node is the javascript runtime environment that runs our code in the file 'index.js'
*/