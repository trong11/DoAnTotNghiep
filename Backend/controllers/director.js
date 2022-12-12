const Director = require('../models/director');
const {uploadImage} = require("../middleware/multer");
const {isValidObjectId} = require("mongoose");
const {sendError, uploadImageToCloud, formatActor} = require("../utils/helper");
const cloudinary = require('../cloud');
const Actor = require("../models/actor");

exports.createDirector = async (req, res) => {
    const {name, about, gender, dob, nationality} = req.body;
    const {file} = req;
    console.log(file);

    const newDirector = new Director({name, about, gender, dob, nationality});

    if (file) {
        const {url, public_id} = await uploadImageToCloud(file.path);
        newDirector.avatar = {url , public_id};
    }
    await newDirector.save();
    res.status(201).json({director: formatActor(newDirector)});
}

exports.updateDirector = async (req, res) => {
    const {name, about, gender, dob, nationality} = req.body;
    const {file} = req;
    const {directorId} = req.params;

    if (!isValidObjectId(directorId)) return sendError(res, 'Invalid request');
    const director = await Director.findById(directorId);

    if (!director) return sendError(res, 'Invalid request!, record not found');

    const public_id = director.avatar.public_id;

    if (public_id && file) {
        const {result} = await cloudinary.uploader.destroy(public_id)
        if (result !== 'ok') {
            return sendError(res, 'Could not remove image from cloud!');
        }
    }
    if (file) {
        const {url, public_id} = await uploadImageToCloud(file.path);
        director.avatar = {url , public_id};
    }
    director.name = name;
    director.about = about;
    director.gender = gender;
    director.dob = dob;
    director.nationality = nationality;

    await director.save();
    res.status(201).json({director: formatActor(director)});
}

exports.removeDirector = async (req, res) => {
    const {directorId} = req.params;

    if (!isValidObjectId(directorId)) return sendError(res, "Invalid request!");

    const director = await Director.findById(directorId);
    if (!director) return sendError(res, "Invalid request, record not found!");

    const public_id = director.avatar?.public_id;

    // remove old image if there was one!
    if (public_id) {
        const {result} = await cloudinary.uploader.destroy(public_id);
        if (result !== "ok") {
            return sendError(res, "Could not remove image from cloud!");
        }
    }

    await Director.findByIdAndDelete(directorId);

    res.json({message: "Record removed successfully."});
};

exports.searchDirector = async (req, res) => {
    const { name } = req.query;
    // const result = await Actor.find({ $text: { $search: `"${query.name}"` } });
    if (!name.trim()) return sendError(res, "Invalid request!");
    const result = await Director.find({
        name: { $regex: name, $options: "i" },
    });

    const directors = result.map((director) => formatActor(director));
    res.json({ results: directors });
};

exports.getLatestDirectors = async (req, res) => {
    const result = await Director.find().sort({createdAt: '-1'}).limit(12);

    const directors = result.map(director => formatActor(director));
    res.json(directors);
}

exports.getSingleDirector = async (req, res) => {
    const {id} = req.params;

    if (!isValidObjectId(id)) return sendError(res, 'Invalid request');
    const director = await Director.findById(id);

    if (!director) return sendError(res, 'Invalid request,actor not found!', 404);
    res.json(formatActor(director));
}

exports.getDirectors = async (req, res) => {
    const { pageNo, limit } = req.query;

    const directors = await Director.find({})
        .sort({ createdAt: -1 })
        .skip(parseInt(pageNo) * parseInt(limit))
        .limit(parseInt(limit));

    const profiles = directors.map((director) => formatActor(director));
    res.json({
        profiles,
    });
};