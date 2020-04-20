const mongoose = require('mongoose');

const { Schema } = mongoose;

const TestimoniesSchema = new Schema({
    parent_id: mongoose.Types.ObjectId,
    author: String,
    body: String,
    is_private: Boolean,
    fingerprint: String,
    upvotes: [{
        upvoter: String,
    }],
    downvotes: [{
        downvoter: String,
    }],
}, { timestamps: true });

TestimoniesSchema.methods.toJSON = function() {
    return {
        _id: this._id,
        parent_id: this.parent_id,
        author: this.author,
        body: this.body,
        is_private: this.is_private,
        fingerprint: this.fingerprint,
        upvotes: this.upvotes,
        downvotes: this.downvotes,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};

mongoose.model('Testimonies', TestimoniesSchema);