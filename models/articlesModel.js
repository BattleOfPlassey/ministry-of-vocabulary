const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const ArticleSchema = mongoose.Schema({
    Word: {
        type: String,
        required: true
    },
    Meaning: {
        type: String,
        required: true
    },
    Mneomonic: {
        type: String
    },
    Usage: {
        type: String
    },
    authorId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    addedOn: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
