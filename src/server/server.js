const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const md5 = require('md5');
const session = require('express-session');
const conn = require('./dbconfig.js');

let connection = conn.connection(mysql);

connection.connect(err => {
  if(err) {
      return err;
  }
})

const route = 'http://localhost:3000';
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}))

let userData = null;
let userFriends = null;

app.get('/getuserdata', (req, res) => {
  return res.json({
    userData
  })
})

app.get('/getuserfriends', (req, res) => {
  return res.json({
    userFriends
  })
})

app.get('/getnewfriends', (req, res) => {
  
  var i;
  let friends = ['1', '2'];
  let thisUserFriends = [];
  
  for (i = 0; i < 2; i++) {

  //let GETFRIENDS_QUERY = `SELECT name, id FROM users`;
  let GETFRIENDS_QUERY = `SELECT name, id FROM users WHERE id='${friends[i]}'`;
  console.log('query uitvoeren ' + GETFRIENDS_QUERY);
  
    connection.query(GETFRIENDS_QUERY, (err, results) => {   
      if(err) { 
        return res.send(err)
      } 
      else {
        thisUserFriends.push(results);
      }
      console.log(thisUserFriends);
    });
    return res.json({ 
      data: thisUserFriends
    });

  } 
});

app.post('/login', ( req, res ) => {
  let email = req.body.email;
  let password = md5(req.body.password);
  let error = null;
  let LOGIN_QUERY = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;

  connection.query(LOGIN_QUERY, (err, results, fields) => {
    if(results.length > 0) {
      userData = results;
      userFriends = results[0].friends;
      res.redirect(route + '/user')
    } else {
      error = 'incorrect';
      res.redirect(route + '/?err=' + error)
      console.log('verkeerde login');
    }
  });

})

app.post('/register', ( req, res ) => {
  const username = req.body.name;
  const email  = req.body.email;
  const pass1 = req.body.password1;
  const pass2 = req.body.password2;
  const password = md5(pass1);

  const USERTAKEN_QUERY = `SELECT * FROM users WHERE email = '${email}'`;
  const REGISTER_QUERY = `INSERT INTO users ( name, email, password ) VALUES ('${username}', '${email}', '${password}')`;

  let error = null;

    connection.query(USERTAKEN_QUERY, (err, results, fields) => {
      if(results.length > 0) {
        error = 2;
        res.redirect(route + '/register?err=' + error);
      } else if (pass1 === pass2){
        connection.query(REGISTER_QUERY, (err, results) => {
          if(err) {
            res.send(err)
          } else {
            error = 0;
            res.redirect(route + '/register?err=' + error);
          }
        });
      } else {
        error = 1
        res.redirect(route + '/register?err=' + error);
      }
    });
})  

app.listen(4000, () => {
    console.log('Server listening on port 4000')
});