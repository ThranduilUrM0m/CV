const mongoose = require('mongoose');

const { Schema } = mongoose;

const LettersSchema = new Schema({
    _from: {
        author: String,
        adresse: String,
        city: String,
        country: String,
    },
    _to: {
        student: String,
        school: String,
        grade: String,
        city: String,
        country: String,
    },
    _body: String,
}, { timestamps: true });

LettersSchema.methods.toJSON = function() {
    return {
        _id: this._id,
        _from: this._from,
        _to: this._to,
        _body: this._body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};
  
mongoose.model('Letters', LettersSchema);