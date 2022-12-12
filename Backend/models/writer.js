const mongoose = require("mongoose");

const writerSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        about: {
            type: String,
            trim: true,
            required: true,
        },
        gender: {
            type: String,
            trim: true,
            required: true,
        },
        dob: {
            type: Date,
        },
        nationality: {
            type:String,
        },
        avatar: {
            type: Object,
            url: String,
            public_id: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Writer", writerSchema);
