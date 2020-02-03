const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const md5 = require('md5');
const session = require('express-session');
const conn = require('./dbconfig.js');
const multer = require('multer');
const path = require('path');

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


//VRIENDEN SIDE
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
  
  let SELECTFRIENDS_QUERY = `SELECT friends FROM users WHERE id=${userID}`;
  

  connection.query(SELECTFRIENDS_QUERY, (err, results) => {
    if(err) {
      return res.send(err);
    } else {
        userFriends = results[0].friends
    }
  })

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
    newFriends = id
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

app.get('/deletefriend', (req, res) => {
  let id = req.query; 
  id = JSON.parse(id.id);
  id = id + ',';

  let deleteFriend = userFriends;
  deleteFriend = deleteFriend.replace(id, "");
  console.log(deleteFriend);
  let DELETEFRIEND_QUERY = `UPDATE users SET friends='${deleteFriend}' WHERE id='${userID}'`;

  connection.query(DELETEFRIEND_QUERY, (err) => {
    if(err) {
      res.send(err);
    } else {
      res.send('Vriend verwijderd');
    }
  })
})
//EINDE VRIENDEN SIDE

//AUTHENTICATION IN SIDE
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

app.post('/logout', (req, res ) => {
 userData = null;
 userFriends = null;
 userID = null;
 currentFriendsArray = [];

 res.redirect(route + '/');
})
//EINDE AUTHENTICATION SIDE

//BERICHTEN SIDE
app.get('/getberichten', ( req, res ) => {
  let GETBERICHTEN_QUERY = `SELECT * FROM messages WHERE user_id=${userID}`;
})

app.get('/postberichten', ( req, res ) => {
  const { message, toUserId } = req.query;

  let POSTBERICHTEN_QUERY = `INSERT INTO messages (message, user_id, from_id) VALUES '${message}', '${toUserId}', '${userID}'`;
})

app.post('/uploadpicture', (req, res) => {
  
  let randomNumber = Math.random();

  console.log(randomNumber);

  const storage = multer.diskStorage({
    destination: '../uploads/',
    filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + randomNumber + path.extname(file.originalname));
    }
  })
  
  const upload = multer({
    storage: storage
  }).single('MyImage')
  
  upload(req, res, (err) => {
    if(err) {
      res.send(err);
    } else {
      let UPLOADPICTURE_QUERY = `INSERT INTO pictures (url, user) VALUES ('${req.file.filename}', '${userID}')`;
      connection.query(UPLOADPICTURE_QUERY, (err) => {
        if(err) {
          res.send(err);
        } else {
          res.redirect(route + '/user');
        }
      })
    }
  })
})

app.get('/getpictures', (req, res) => {
  let SELECTPICTURES_QUERY = `SELECT * FROM pictures WHERE user=${userID}`;

  connection.query(SELECTPICTURES_QUERY, (err, results) => {
    if(err) {
      res.send(err);
    } else {
      res.json({
        data: results
      })
    }
  })
})



app.listen(4000, () => {
    console.log('Server listening on port 4000')
});