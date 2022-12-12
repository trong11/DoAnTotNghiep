const Writer = require('../models/writer');
const {isValidObjectId} = require("mongoose");
const {sendError, uploadImageToCloud, formatActor} = require("../utils/helper");
const cloudinary = require('../cloud');

exports.createWriter = async (req, res) => {
    const {name, about, gender, dob, nationality} = req.body;
    const {file} = req;
    console.log(file);

    const newWriter = new Writer({name, about, gender, dob, nationality});

    if (file) {
        const {url, public_id} = await uploadImageToCloud(file.path);
        newWriter.avatar = {url , public_id};
    }
    await newWriter.save();
    res.status(201).json({writer: formatActor(newWriter)});
}

exports.updateWriter = async (req, res) => {
    const {name, about, gender, dob, nationality} = req.body;
    const {file} = req;
    const {writerId} = req.params;

    if (!isValidObjectId(writerId)) return sendError(res, 'Invalid request');
    const writer = await Writer.findById(writerId);

    if (!writer) return sendError(res, 'Invalid request!, record not found');

    const public_id = writer.avatar.public_id;

    if (public_id && file) {
        const {result} = await cloudinary.uploader.destroy(public_id)
        if (result !== 'ok') {
            return sendError(res, 'Could not remove image from cloud!');
        }
    }
    if (file) {
        const {url, public_id} = await uploadImageToCloud(file.path);
        writer.avatar = {url , public_id};
    }
    writer.name = name;
    writer.about = about;
    writer.gender = gender;
    writer.dob = dob;
    writer.nationality = nationality;

    await writer.save();
    res.status(201).json({writer: formatActor(writer)});
}

exports.removeWriter = async (req, res) => {
    const {writerId} = req.params;

    if (!isValidObjectId(writerId)) return sendError(res, "Invalid request!");

    const writer = await Writer.findById(writerId);
    if (!writer) return sendError(res, "Invalid request, record not found!");

    const public_id = writer.avatar?.public_id;

    // remove old image if there was one!
    if (public_id) {
        const {result} = await cloudinary.uploader.destroy(public_id);
        if (result !== "ok") {
            return sendError(res, "Could not remove image from cloud!");
        }
    }

    await Writer.findByIdAndDelete(writerId);

    res.json({message: "Record removed successfully."});
};

exports.searchWriter = async (req, res) => {
    const { name } = req.query;
    // const result = await Actor.find({ $text: { $search: `"${query.name}"` } });
    if (!name.trim()) return sendError(res, "Invalid request!");
    const result = await Writer.find({
        name: { $regex: name, $options: "i" },
    });

    const writers = result.map((writer) => formatActor(writer));
    res.json({ results: writers });
};

exports.getLatestWriters= async (req, res) => {
    const result = await Writer.find().sort({createdAt: '-1'}).limit(12);

    const writers = result.map(writer => formatActor(writer));
    res.json(writers);
}

exports.getSingleWriter = async (req, res) => {
    const {id} = req.params;

    if (!isValidObjectId(id)) return sendError(res, 'Invalid request');
    const writer = await Writer.findById(id);

    if (!writer) return sendError(res, 'Invalid request,actor not found!', 404);
    res.json(formatActor(writer));
}

exports.getWriters = async (req, res) => {
    const { pageNo, limit } = req.query;

    const writers = await Writer.find({})
        .sort({ createdAt: -1 })
        .skip(parseInt(pageNo) * parseInt(limit))
        .limit(parseInt(limit));

    const profiles = writers.map((writer) => formatActor(writer));
    res.json({
        profiles,
    });
};