const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

/* GET home page. */
app.get('/', (req, res) => {
  res.render('index', { title: 'MusicHub' });
});

app.get('/login', (req, res) => {
  res.redirect('https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID + '&response_type=code&redirect_uri=' + REDIRECT_URI + '&show_dialog=true');
})


module.exports = app;