var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TrackSchema = new Schema(
  {
    track_name: {type: String, required: true, maxLength: 100},
    track_id: {type: String, required: true, maxLength: 22},
    track_url: {type: String, required: true, maxLength: 500},
    
    artist_name: {type: String, required: true, maxLength: 100},
    artist_id: {type: String, required: true, maxLength: 22},
    artist_url: {type: String, required: true, maxLength: 500},

    album_name: {type: String, required: true, maxLength: 100},
    album_id: {type: String, required: true, maxLength: 22},
    album_cover: {type: String, required: true, maxLength: 500}
  }
);


// Virtual for track's artist
TrackSchema.virtual('artist').get(function () {
  var artist_name = '';
  if (this.artist_name) {
    artist_name = this.artist_name
  }
  if (!this.artist_name) {
    artist_name = '';
  }
  return artist_name;
});

// Virtual for track's artist ID
TrackSchema.virtual('artistID').get(function () {
    var artist_id = '';
    if (this.artist_id) {
        artist_id = this.artist_id
    }
    if (!this.artist_id) {
        artist_id = '';
    }
    return artist_id;
  });

// Virtual for track's artist url
TrackSchema.virtual('artistURL').get(function () {
    var artist_url = '';
    if (this.artist_url) {
        artist_url = this.artist_url
    }
    if (!this.artist_url) {
        artist_url = '';
    }
    return artist_url;
  });

// Virtual for track's name
TrackSchema.virtual('trackName').get(function () {
    var track_name = '';
    if (this.track_name) {
        track_name = this.track_name
    }
    if (!this.track_name) {
        track_name = '';
    }
    return track_name;
  });

// Virtual for track's ID
TrackSchema.virtual('trackID').get(function () {
    var track_id = '';
    if (this.track_id) {
        track_id = this.track_id
    }
    if (!this.track_id) {
        track_id = '';
    }
    return track_id;
  });

  // Virtual for track's url
TrackSchema.virtual('trackURL').get(function () {
    var track_url = '';
    if (this.track_url) {
        track_url = this.track_url
    }
    if (!this.track_url) {
        track_url = '';
    }
    return track_url;
  });

// Virtual for track's album name
TrackSchema.virtual('albumName').get(function () {
    var album_name = '';
    if (this.album_name) {
        album_name = this.album_name
    }
    if (!this.album_name) {
        album_name = '';
    }
    return album_name;
  });

// Virtual for track's album ID
TrackSchema.virtual('albumID').get(function () {
    var album_id = '';
    if (this.album_id) {
        album_id = this.album_id
    }
    if (!this.album_id) {
        album_id = '';
    }
    return album_id;
  });

// Virtual for track's album cover
TrackSchema.virtual('albumCover').get(function () {
    var album_cover = '';
    if (this.album_cover) {
        album_cover = this.album_cover
    }
    if (!this.album_cover) {
        album_cover = '';
    }
    return album_cover;
  });


//Export model
module.exports = mongoose.model('Track', TrackSchema);