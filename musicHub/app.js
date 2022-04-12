var fetch =require('node-fetch');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://stangerp:pbv5maB2hqm5IGj1@musichub.bq2gg.mongodb.net/MusicHub?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var domino = require('domino');
var Element = domino.impl.Element;

var window = domino.createWindow();
var document = window.document;


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.locals.basedir = app.get('views');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  next(createError(404));
//});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



const APIController = (function() {
  
  const clientId = 'f6a1f742465b40baa1529fe107fc938c';
  const clientSecret = 'c60f8154ea72416db2311008c23ab875';
  
  //private methods
  const _getToken = async () => {

    const result = await fetch(`https://accounts.spotify.com/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    return data.access_token;
  }

  const _getGenres = async (token) => {

    const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const data = await result.json();
    return data.categories.items;
  }

  const _getPlaylistByGenre = async (token, genreId) => {

    const limit = 10;
    
    const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const data = await result.json();
    return data.playlists.items;
  }

  const _getTracks = async (token, tracksEndPoint) => {

    const limit = 10;

    const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const data = await result.json();
    return data.items;
  }

  const _getTrack = async (token, trackEndPoint) => {

    const result = await fetch('$(trackEndPoint)', {
      method: 'GET',
      headers: {'Authorization': `Bearer ${token}`}
    });

    const data = await result.json();
    return data;
  }


  //public methods
  return {
    getToken() {
      return _getToken();
    },
    getGenres(token) {
      return _getGenres(token);
    },
    getPlaylistByGenre(token, genreId) {
      return _getPlaylistByGenre(token, genreId);
    },
    getTracks(token, tracksEndPoint) {
      return _getTracks(token, tracksEndPoint);
    },
    getTrack(token, trackEndPoint) {
      return _getTrack(token, trackEndPoint);
    }
  }


})();


// UI Module
const UIController = (function() {

  //object to hold references to html selectors
  const DOMElements = {
      selectGenre: '#select_genre',
      selectPlaylist: '#select_playlist',
      buttonSubmit: '#btn_submit',
      divSongDetail: '#song-detail',
      hfToken: '#hidden_token',
      divSonglist: '.song-list'
  }

  //public methods
  return {

      //method to get input fields
      inputField() {
          return {
              genre: document.querySelector(DOMElements.selectGenre),
              playlist: document.querySelector(DOMElements.selectPlaylist),
              tracks: document.querySelector(DOMElements.divSonglist),
              submit: document.querySelector(DOMElements.buttonSubmit),
              songDetail: document.querySelector(DOMElements.divSongDetail)
          }
      },

      // need methods to create select list option
      createGenre(text, value) {
          const html = `<option value="${value}">${text}</option>`;
          document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
      }, 

      createPlaylist(text, value) {
          const html = `<option value="${value}">${text}</option>`;
          document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
      },

      // need method to create a track list group item 
      createTrack(id, name) {
          const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
          document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
      },

      // need method to create the song detail
      createTrackDetail(img, title, artist) {

          const detailDiv = document.querySelector(DOMElements.divSongDetail);
          // any time user clicks a new song, we need to clear out the song detail div
          detailDiv.innerHTML = '';

          const html = 
          `
          <div class="row col-sm-12 px-0">
              <img src="${img}" alt="">        
          </div>
          <div class="row col-sm-12 px-0">
              <label for="Genre" class="form-label col-sm-12">${title}:</label>
          </div>
          <div class="row col-sm-12 px-0">
              <label for="artist" class="form-label col-sm-12">By ${artist}:</label>
          </div> 
          `;

          detailDiv.insertAdjacentHTML('beforeend', html)
      },

      resetTrackDetail() {
          this.inputField().songDetail.innerHTML = '';
      },

      resetTracks() {
          this.inputField().tracks.innerHTML = '';
          this.resetTrackDetail();
      },

      resetPlaylist() {
          this.inputField().playlist.innerHTML = '';
          this.resetTracks();
      },
      
      storeToken(value) {
          //document.querySelector(DOMElements.hfToken).value = value;
      },

      getStoredToken() {
          return {
              token: document.querySelector(DOMElements.hfToken).value
          }
      }
  }

})();

const APPController = (function(UICtrl, APICtrl) {

  // get input field object ref
  const DOMInputs = UICtrl.inputField();

  // get genres on page load
  const loadGenres = async () => {
      //get the token
      const token = await APICtrl.getToken();           
      //store the token onto the page
      UICtrl.storeToken(token);
      //get the genres
      const genres = await APICtrl.getGenres(token);
      //populate our genres select element
      //genres.forEach(element => UICtrl.createGenre(element.name, element.id));
  }

  // create genre change event listener
  if(DOMInputs.genre){
    DOMInputs.genre.addEventListener('change', async () => {
        //reset the playlist
        UICtrl.resetPlaylist();
        //get the token that's stored on the page
        const token = UICtrl.getStoredToken().token;        
        // get the genre select field
        const genreSelect = UICtrl.inputField().genre;       
        // get the genre id associated with the selected genre
        const genreId = genreSelect.options[genreSelect.selectedIndex].value;             
        // ge the playlist based on a genre
        const playlist = await APICtrl.getPlaylistByGenre(token, genreId);       
        // create a playlist list item for every playlist returned
        playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
    });
  }
   

  // create submit button click event listener
  if(DOMInputs.submit){
    DOMInputs.submit.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        // clear tracks
        UICtrl.resetTracks();
        //get the token
        const token = UICtrl.getStoredToken().token;        
        // get the playlist field
        const playlistSelect = UICtrl.inputField().playlist;
        // get track endpoint based on the selected playlist
        const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
        // get the list of tracks
        const tracks = await APICtrl.getTracks(token, tracksEndPoint);
        // create a track list item
        tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name))
        
    });
  }

  // create song selection click event listener
  if(DOMInputs.tracks){
    DOMInputs.tracks.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        UICtrl.resetTrackDetail();
        // get the token
        const token = UICtrl.getStoredToken().token;
        // get the track endpoint
        const trackEndpoint = e.target.id;
        //get the track object
        const track = await APICtrl.getTrack(token, trackEndpoint);
        // load the track details
        UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name);
    });    
  }


  return {
      init() {
          console.log('App is starting');
          loadGenres();
      }
  }

})(UIController, APIController);

// will need to call a method to load the genres on page load
APPController.init();

module.exports = app;
