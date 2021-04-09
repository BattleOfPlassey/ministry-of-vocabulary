const mongoose = require('mongoose');
// const ObjectId = mongoose.Schema.Types.ObjectId;

const ArticleSchema = mongoose.Schema({
    word: {
        type: String,
        required: true
    },
    meaning: {
        type: String,
        required: true
    },
    mneomonic: {
        type: String
    },
    usage: {
        type: String
    },
    addedOn: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
