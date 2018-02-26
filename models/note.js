var mongoose = require("mongoose");

// reference to Schema constructor
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    title: String,
    body: String
});

// This creates model from the above schema, using mongoose model
var Note = mongoose.model("Note", NoteSchema);

//Export the Note model
module.exports = Note; 

