const mysql = require('mysql');

const pool = mysql.createPool ({
    connectionLimit : 200,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME,
    port            : 8889
});

exports.view = ( req , res ) => 
{
    pool.getConnection((err,connection) => 
    {
     connection.query('SELECT * FROM user WHERE status = "active"' , (err , rows) =>
     {
        connection.release();
        if(!err) res.render('home' , {rows});
        else console.log(err);

        console.log('The data from the user table : \n', rows);
     })
    });
}
exports.find = ( req , res ) => 
{
    let searchTerm = req.body.search;
  

    pool.getConnection((err,connection) => 
    {
     connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?',['%' + searchTerm + '%', '%' + searchTerm + '%'] , (err , rows) =>
     {
        connection.release();
        if(!err) res.render('home' , { rows } );
        else console.log(err);

        console.log('The data from the user table : \n', rows);
     })
    });  
}

exports.form = ( req , res ) => 
{
     res.render('add-user');
}    

// Add new user
exports.create = (req, res) => {
    const { first_name, last_name, email, phone, comments }  = req.body;

    pool.getConnection((err, connection) => {

    // User the connection
    connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?',[first_name,
    last_name, email, phone, comments],(err, rows) =>
    {
    // When done with the connection, release it
    connection.release();
    if(!err) res.render('add-user' , { alert : 'User added successfully'});
    else console.log(err);
    
    console.log('The data from user table: \n ', rows);
    })
    });
   
    }

    exports.edit = (req, res) => {
        
    pool.getConnection((err,connection) => 
    {
     connection.query('SELECT * FROM user WHERE id = ? ',[ req.params.id] , (err , rows) =>
     {
        connection.release();
        if(!err) res.render('edit-user' , { rows } );
        else console.log(err);

        console.log('The data from the user table : \n', rows);
     })
    });

    }

    exports.update = (req, res) => {
        
        const { first_name, last_name, email, phone, comments }  = req.body;

        pool.getConnection((err,connection) => 
        {
         connection.query('UPDATE user SET first_name = ? , last_name = ? , email = ? , phone = ? , comments = ? WHERE id = ? ',[ first_name, last_name, email, phone, comments , req.params.id] , (err , rows) =>
         {
            connection.release();
            if(!err) 
            pool.getConnection((err,connection) => 
            {
             connection.query('SELECT * FROM user WHERE status = "active"' , (err , rows) =>
             {
                connection.release();
                if(!err) res.render('home' , {rows});
                else console.log(err);
        
                console.log('The data from the user table : \n', rows);
             })
            });
            else console.log(err);
    
            console.log('The data from the user table : \n', rows);
         })
        });
    
        }

        exports.delete = (req, res) => {
        
            pool.getConnection((err,connection) => 
            {
             connection.query('DELETE FROM user WHERE id = ? ',[ req.params.id] , (err , rows) =>
             {
            
                if(!err) connection.query('SELECT * FROM user WHERE status = "active"' , (err , rows) =>
                {
                   connection.release();
                   if(!err) res.render('home' , {rows});
                   else console.log(err);
           
                   console.log('The data from the user table : \n', rows);
                })

                else console.log(err);
        
                console.log('The data from the user table : \n', rows);
             })
            });
        
            }


            exports.viewall = (req, res) => {
        
                pool.getConnection((err,connection) => 
                {
                 connection.query('SELECT * FROM user WHERE id = ? ',[ req.params.id] , (err , rows) =>
                 {
                    connection.release();
                    if(!err) res.render('view-user' , { rows } );
                    else console.log(err);
            
                    console.log('The data from the user table : \n', rows);
                 })
                });
            
                }