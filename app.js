const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');

require('dotenv').config();

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded ({extended : false}) );

//Parse application json
app.use(bodyParser.json());

//Static Files
app.use(express.static('public'));

//Templating engine 
app.engine('.hbs', exphbs.engine({ extname: '.hbs'}));

app.set( 'view engine' , 'hbs');

const routes = require('./server/routes/user');

app.use('/' , routes);


app.listen(port, () => console.log(`Server listening on ${port}`));


const pool = mysql.createPool ({
    connectionLimit : 200,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME,
    port            : 8889
});

pool.getConnection((err,connection) => 
{
 if(err) throw err;
 else console.log('Connected as ID ' + connection.threadId);
});