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

app.get('/getuserid', (req, res) => {
  return res.json({
    data: userID
  })
})

app.get('/getuserdata', (req, res) => {
  let user = req.query; 
  user = JSON.parse(user.user);
  let LOGIN_QUERY = `SELECT * FROM users WHERE id='${user}'`;

  connection.query(LOGIN_QUERY, (err, results) => {
    if(err) {
      res.send(err)
    } else {
      return res.json({
        data: results
      })
    }
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

  let user = req.query; 
  user = JSON.parse(user.user);
  
  let SELECTFRIENDS_QUERY = `SELECT friends FROM users WHERE id=${user}`;
  

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
      res.redirect(route + '/user?user=' + userID)
    } else {
      error = 'incorrect';
      res.redirect(route + '/?err=' + error)
    }
  });

})

app.post('/register', ( req, res ) => {
  const username = req.body.name;
  const email  = req.body.email;
  const pass1 = req.body.password1;
  const pass2 = req.body.password2;
  const password = md5(pass1);

  const avatar = 'useravatar.png';

  const USERTAKEN_QUERY = `SELECT * FROM users WHERE email = '${email}'`;
  const REGISTER_QUERY = `INSERT INTO users ( name, email, password, avatar ) VALUES ('${username}', '${email}', '${password}', '${avatar}')`;

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

app.get('/getvisitinguserdata', (req, res ) => {
  let visitUser = req.query
  visitUser = JSON.parse(visitUser.visitUser)
  let LOGIN_QUERY = `SELECT * FROM users WHERE id=${visitUser}`;

  connection.query(LOGIN_QUERY, (err, results, fields) => {
    if(err) {
      res.send(err)
    } else {
      userData = results;
      res.redirect(route + '/user?user=' + userID)
    }
  });
})

//BERICHTEN SIDE
app.get('/getmessages', ( req, res ) => {
  let user = req.query
  user = JSON.parse(user.user)
  let GETBERICHTEN_QUERY = `SELECT * FROM messages WHERE user_id=${user}`;

  connection.query(GETBERICHTEN_QUERY, (err, results) => {
    if(err) {
      res.send(err);
    } else {
      res.json({
        data: results
      })
    }
  })
})

app.post('/placemessage', ( req, res ) => {
  const message = req.body.message;
  const toUserId = req.query.thisUserID;

  let POSTBERICHTEN_QUERY = `INSERT INTO messages (message, user_id, from_id) VALUES ('${message}', '${toUserId}', '${userID}')`;

  connection.query(POSTBERICHTEN_QUERY, (err) => {
    if(err) {
      res.send(err);
    } else {
      res.redirect(route + `/user?user=${toUserId}`);
    }
  })
})

app.post('/uploadpicture', (req, res) => {
  
  let randomNumber = Math.random();

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
          res.redirect(route + `/user?user=${userID}`);
        }
      })
    }
  })
})

app.get('/getpictures', (req, res) => {
  const userID = req.query.thisUserID;
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

app.post('/home' , (req, res) => {
  res.redirect(route + `/user?user=${userID}`)
})

app.post('/updateprofile', (req, res) => {
  let userName = req.body.name;
  let userColor = req.body.color;
  let userFont = req.body.font

  let UPDATEPROFILE_QUERY = null;
  if(userName === '') {
    UPDATEPROFILE_QUERY = `UPDATE users SET color='${userColor}', font='${userFont}' WHERE id='${userID}'`
  } else {
    UPDATEPROFILE_QUERY = `UPDATE users SET name='${userName}', color='${userColor}', font='${userFont}' WHERE id='${userID}'`
  }
  
  
  connection.query(UPDATEPROFILE_QUERY, (err) => {
    if(err) {
      res.send(err);
    } else {
      res.redirect(route + `/user?user=${userID}`);
    }
  })
})

app.post('/updateprofileavatar', (req, res) => {
  let filename = null
  const storage = multer.diskStorage({
    destination: '../uploads/',
    filename: function(req, file, cb) {
      filename = file.fieldname + userID + path.extname(file.originalname)
      cb(null, filename);
    }
  })
  
  const upload = multer({
    storage: storage
  }).single('useravatar')

  
  upload(req, res, (err) => {
    if(err) {
      res.send(err);
    } else {
      let UPDATEPERSONAVATAR_QUERY = `UPDATE users SET avatar='${filename}' WHERE id='${userID}'`;
      connection.query(UPDATEPERSONAVATAR_QUERY, (err) => {
        if(err) {
          res.send(err)
        } else {
          res.redirect(route + `/user?user=${userID}`);
        }
      })
    }
  })
})


app.listen(4000, () => {
    console.log('Server listening on port 4000')
});