const mongoose = require('mongoose');

const { Schema } = mongoose;

const NotificationsSchema = new Schema({
    type: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 864000 }
});

NotificationsSchema.methods.toJSON = function() {
    return {
        _id: this._id,
        type: this.type,
        description: this.description,
        author: this.author,
        createdAt: this.createdAt,
    };
};

mongoose.model("Notifications", NotificationsSchema);