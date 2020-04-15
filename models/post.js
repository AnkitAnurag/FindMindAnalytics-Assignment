const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    post: {
    type: String
    },
    author: {
        id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
    }
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;