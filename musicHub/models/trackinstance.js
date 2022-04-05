var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TrackInstanceSchema = new Schema(
  {
    trackObjectId: { type: Schema.Types.ObjectId, ref: 'Track', required: true }, //reference to the associated track
    track_name: {type: String, required: true},
    track_id: {type: String, required: true},
    track_url: {type: String, required: true},

    artist_name: {type: String, required: true},
    artist_id: {type: String, required: true},
    artist_url: {type: String, required: true},

    album_name: {type: String, required: true},
    album_id: {type: String, required: true},
    album_cover: {type: String, required: true}
  }
);

// Virtual for trackinstance's URL
TrackInstanceSchema
.virtual('url')
.get(function () {
  return '/catalog/trackinstance/' + this._id;
});

//Export model
module.exports = mongoose.model('TrackInstance', TrackInstanceSchema);