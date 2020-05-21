const mongoose = require('mongoose');

const { Schema } = mongoose;

const NotificationsSchema = new Schema({
    type: String,
    description: String,
    author: String,
}, {timestamps: true });

NotificationsSchema.methods.toJSON = function() {
    return {
        _id: this._id,
        type: this.type,
        description: this.description,
        author: this.author,
    };
};

mongoose.model("Notifications", NotificationsSchema);