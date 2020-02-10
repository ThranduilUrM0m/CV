const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventsSchema = new Schema({
    _name: String,
    _date_start: Date,
    _days: Number,
    _type: String,
}, { timestamps: true });
EventsSchema.methods.toJSON = function() {
    return {
        _id: this._id,

        _name: this._name,
        _date_start: this._date_start,
        _days: this._days,
        _type: this._type,

        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};
mongoose.model('Events', EventsSchema);