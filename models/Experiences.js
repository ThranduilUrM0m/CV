const mongoose = require('mongoose');
const { Schema } = mongoose;

const ExperiencesSchema = new Schema({
    title: String,
    brand: String,
    description: String,
    date_start: Date,
    days: Number,
}, { timestamps: true });

ExperiencesSchema.methods.toJSON = function() {
    return {
        _id: this._id,
        title: this.title,
        brand: this.brand,
        description: this.description,
        date_start: this.date_start,
        days: this.days,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
}

mongoose.model('Experiences', ExperiencesSchema);