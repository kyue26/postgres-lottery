const pg = require('pg');

const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())

app.config(function(){
    app.use(express.bodyParser());
});

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
    const queryText = 'SELECT user_tickets FROM ' + tableName + ' WHERE user_id = ' + name + ';';

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
        const dec = num - 1;
        const queryText = 'SELECT * FROM ' + tableName + ' ORDER BY user_id OFFSET ' + dec + ' LIMIT 1;';
    
        const res = await client.query(queryText);
        console.log(res);
        
        //close connection
        await client.end();
    
        return res;
}

// here we get all the users from the table
async function getAllFromDatabase() {
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
    const queryText = 'SELECT * FROM ' + tableName + ';';

    const res = await client.query(queryText);
    console.log(res);
    
    //close connection
    await client.end();

    return res;
}

app.get('', async (req, res) => {
    const nameCards = await getAllFromDatabase();
    res.send(nameCards);
})

// WHAT DOES ASYNC DO?? apparently just asynchronous function

// this is both to get the num of tickets
// as well as checking whether they are a valid user
app.get('/login', async (req, res) => {
    const tix = await getTixFromDatabase();
    res.send(tix);
})

// we want this to get the winner
app.get('/winner', async (req, res) => {
    const nameCards = await getAllFromDatabase();
    let size = nameCards.length;
    let index = Math.floor(getRandomArbitrary(1, size));

    const winner = await getUserFromDatabase(index - 1);
    //call database function

    res.send(winner);
})

app.post('/newuser', async (req, res) => {
    
    console.log(req);
    //console.log(req.id);
    const response = await insertIntoDatabase(req.id);
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