const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookmarkSchema = new Schema({
    word : {
        type : String, 
        required : true
    },
    definitions:{
        type: Object,
        required : true
    },

})

const Bookmark = mongoose.model("Bookmark",bookmarkSchema);
module.exports = Bookmark;