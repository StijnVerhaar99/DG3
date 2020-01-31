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
let userID = null;
let currentFriendsArray = [];


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

//CURRENT
app.get('/setcurrentfriends', (req, res) => {
function setFriendsArray(friends) {
    let arrayFriends = friends.split(',');
    return arrayFriends;
}
  
  var i;
  let friends = setFriendsArray(userFriends)
  currentFriendsArray = [];

  for (i = 0; i < friends.length; i++) {
    const friend = friends[i];

    const CURRENTFRIENDS_QUERY = `SELECT name, id FROM users WHERE id = '${friend}'`;

    connection.query(CURRENTFRIENDS_QUERY, (err, res) => {
      if(err) {
        return res.send(err);
      } else {
        currentFriendsArray.push(res);
      }
    }) 
  } 
})

//CURRENT
app.get('/getcurrentfriends', (req, res) => {
  return res.json({
    data : currentFriendsArray
  })
})

//NEW
app.get('/setnewfriends', (req, res) => {
  function setFriendsArray(friends) {
      let arrayFriends = friends.split(',');
      return arrayFriends;
  }
    
  var i;
  let friends = setFriendsArray(userFriends);
  friends.push(userID);
  let WHEREQUERY = '';

  for (i = 0; i < friends.length; i++) {
    const friend = friends[i];
    let friendsLengthStopper = (friends.length -1)  
    if(friendsLengthStopper === i) {
      WHEREQUERY += `id <> '${friend}'`
    } else {
      WHEREQUERY += `id <> '${friend}' AND `
    }     
  } 

  const NEWFRIENDS_QUERY = `SELECT name, id FROM users WHERE ` + WHEREQUERY;
  
  connection.query(NEWFRIENDS_QUERY, (err, results) => {
    if(err) { 
      return res.send(err)
    } 
    else {
      return res.json({
          data: results
      })
    }
  })
})

app.get('/addfriend', (req, res) => {
  let id = req.query;
  id = JSON.parse(id.id);
  
  let newFriends = null
  if (userFriends === '') {
    newFriends = id + ','
  } else {
    newFriends = userFriends + ',' + id;
  }

  let ADDFRIEND_QUERY = `UPDATE users SET friends='${newFriends}' WHERE id='${userID}'`; 

  connection.query(ADDFRIEND_QUERY, (err, results) => {
    if(err) {
      return res.send(err)
    } else {
      let UPDATEDFRIENDS_QUERY = `SELECT friends, name FROM users WHERE id=${userID}`;
      connection.query(UPDATEDFRIENDS_QUERY, (err, results, fields) => {
        userFriends = results[0].friends;
      })
      return res.send('Vriend toegevoegd');
    }
  })

  
  
})


app.post('/login', ( req, res ) => {
  let email = req.body.email;
  let password = md5(req.body.password);
  let error = null;
  let LOGIN_QUERY = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;

  connection.query(LOGIN_QUERY, (err, results, fields) => {
    if(results.length > 0) {
      userData = results;
      userFriends = results[0].friends;
      userID = results[0].id;
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