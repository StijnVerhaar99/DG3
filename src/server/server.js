const express = require('express');
const session = require('express-session');
const app = express();
const cors = require('cors');
const route = 'http://localhost:3000';
const mysql = require('mysql2');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dg3'
})

connection.connect(err => {
  if(err) {
      return err;
  }
})


app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(session);

app.post('/login', ( req, res ) => {
  res.redirect(route + '/register');
})

app.post('/register', ( req, res ) => {
  const username = req.body.name;
  const email  = req.body.email;
  const pass1 = req.body.password1;
  const pass2 = req.body.password2;

  req.session.username = username;

  console.log(pass2);

  res.redirect(route + '/register');
})  

app.listen(4000, () => {
    console.log('Server listening on port 4000')
});