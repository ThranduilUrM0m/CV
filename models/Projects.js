const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProjectsSchema = new Schema({
    title: String,
    image: String,
    author: String,
    tag: [String],
    comment: [{
        author: String,
        body: String,
        date: Date,
        upvotes: [{
            upvoter: String,
        }],
        downvotes: [{
            downvoter: String,
        }],
    }],
    upvotes: [{
        upvoter: String,
    }],
    downvotes: [{
        downvoter: String,
    }],
    view: [{
        viewer: String,
        _yes_or_no: Boolean,
    }],
}, { timestamps: true });

ProjectsSchema.methods.toJSON = function() {
    return {
        _id: this._id,
        title: this.title,
        image: this.image,
        author: this.author,
        tag: this.tag,
        comment: this.comment,
        upvotes: this.upvotes,
        downvotes: this.downvotes,
        view: this.view,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
}

mongoose.model('Projects', ProjectsSchema);