const mongoose = require('mongoose');

const { Schema } = mongoose;

const ArticlesSchema = new Schema({
  title: String,
  body: String,
  author: String,
  categorie: String,
  _hide: Boolean,
  tag: [String],
  comment: [{
    parent_id: mongoose.Types.ObjectId,
    author: String,
    body: String,
    fingerprint: String,
    _createdAt: Date,
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
    _createdAt: Date,
  }],
}, { timestamps: true });

ArticlesSchema.methods.toJSON = function() {
  return {
    _id: this._id,
    title: this.title,
    body: this.body,
    author: this.author,
    categorie: this.categorie,
    _hide: this._hide,
    tag: this.tag,
    comment: this.comment,
    upvotes: this.upvotes,
    downvotes: this.downvotes,
    view: this.view,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

mongoose.model('Articles', ArticlesSchema);