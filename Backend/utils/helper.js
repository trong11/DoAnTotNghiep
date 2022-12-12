const crypto = require("crypto");
const cloudinary = require('../cloud');
const Review = require("../models/review");


exports.sendError = (res, error, statusCode = 401) => {
    res.status(statusCode).json({error});
}

exports.generateRandomByte = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(30, (err, buff) => {
            if (err) reject(err);
            const buffString = buff.toString('hex')
            console.log(buffString);
            resolve(buffString);
        });
    })
}

exports.handleNotFound = (req, res) => {
    this.sendError(res, 'Not found', 404);
}

exports.uploadImageToCloud = async (file) => {
    const {secure_url: url, public_id} = await cloudinary.uploader.upload(file, {
        gravity: "face",
        height: 500,
        width: 500,
        crop: "thumb"
    });
    return {url, public_id};
}

exports.formatActor = actor => {
    const {name, gender, about, _id, dob, nationality, avatar} = actor;
    return {id: _id, name, about, gender, dob, nationality, avatar: actor.avatar?.url}
}

exports.parseData = (req, res, next) => {
    const {trailer, cast, genres, tags, writers} = req.body;

    if (trailer) req.body.trailer = JSON.parse(trailer);
    if (cast) req.body.cast = JSON.parse(cast);
    if (genres) req.body.genres = JSON.parse(genres);
    if (tags) req.body.tags = JSON.parse(tags);
    if (writers) req.body.writers = JSON.parse(writers);

    next();
}

exports.averageRatingPipeline = (movieId, startDate = "2022-01-01", endDate = "2022-31-12") => {
    return [
        {
            $lookup: {
                from: "Review",
                localField: "rating",
                foreignField: "_id",
                as: "avgRat",
            },
        },
        {
            $match: {
                parentMovie: movieId,
                createdAt: {
                    $gte: new Date(startDate + "T00:00:00.000Z"),
                    $lt: new Date(endDate+ "T23:59:59.000Z"),
                },
            },
        },
        {
            $group: {
                _id: null,
                ratingAvg: {
                    $avg: "$rating",
                },
                reviewCount: {
                    $sum: 1,
                },
            },
        },
    ];
};

exports.relatedMovieAggregation = (tags, movieId) => {
    return [
        {
            $lookup: {
                from: "Movie",
                localField: "tags",
                foreignField: "_id",
                as: "relatedMovies",
            },
        },
        {
            $match: {
                tags: {$in: [...tags]},
                _id: {$ne: movieId},
            },
        },
        {
            $project: {
                title: 1,
                poster: "$poster.url",
                responsivePosters: "$poster.responsive",
            },
        },
        {
            $limit: 5,
        },
    ];
};

exports.genreAggregation = (genres, type) => {
    const matchOptions = {
        genres: {$in: [genres]},
        status: {$eq: "public"},
    };

    if (type) matchOptions.type = {$eq: type};

    return [
        {
            $lookup: {
                from: "Movie",
                localField: "genres",
                foreignField: "_id",
                as: "genreFilter",
            },
        },
        {
            $match: matchOptions,
        },
        {
            $project: {
                title: 1,
                poster: "$poster.url",
                responsivePosters: "$poster.responsive",
                createdAt: "$createdAt",
            },
        },
    ];
};

exports.actorAggregation = (actorId) => {
    return [
        {
            $lookup: {
                from: "Movie",
                localField: "cast",
                foreignField: "_id",
                as: "actorFilter",
            },
        },
        {$unwind:"$cast"},
        {
            $match: {
                actor: {$in: [actorId]},
                status: {$eq: "public"},
            },
        },
        {
            $project: {
                title: 1,
                poster: "$poster.url",
                responsivePosters: "$poster.responsive",
                createdAt: "$createdAt",
            },
        },
    ];
};


exports.topRatedMoviesPipeline = (type, limit = 6) => {
    const matchOptions = {
        reviews: {$exists: true},
        status: {$eq: "public"},
    };

    if (type) matchOptions.type = {$eq: type};

    return [
        {
            $lookup: {
                from: "Movie",
                localField: "reviews",
                foreignField: "_id",
                as: "topRated",
            },
        },
        {
            $match: matchOptions,
        },
        {
            $project: {
                title: 1,
                poster: "$poster.url",
                responsivePosters: "$poster.responsive",
                reviewCount: {$size: "$reviews"},
            },
        },
        {
            $sort: {
                reviewCount: -1,
            },
        },
        {
            $limit: parseInt(limit),
        },
    ];
};

exports.getAverageRatings = async (movieId, startDate, endDate) => {
    const [aggregatedResponse] = await Review.aggregate(
        this.averageRatingPipeline(movieId, startDate, endDate)
    );
    const reviews = {};

    if (aggregatedResponse) {
        const {ratingAvg, reviewCount} = aggregatedResponse;
        reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
        reviews.reviewCount = reviewCount;
    }
    return reviews;
};

exports.reviewCountPipeline = (userId) => {
    return [
        {
            $lookup: {
                from: "Review",
                localField: "rating",
                foreignField: "_id",
                as: "avgRat",
            },
        },
        {
            $match: {owner: userId},
        },
        {
            $group: {
                _id: null,
                ratingAvg: {
                    $avg: "$rating",
                },
                reviewCount: {
                    $sum: 1,
                },
            },
        },
    ];
};

exports.getReviewCount = async (userId) => {
    const [aggregatedResponse] = await Review.aggregate(
        this.reviewCountPipeline(userId)
    );
    const reviews = {};

    if (aggregatedResponse) {
        const {ratingAvg, reviewCount} = aggregatedResponse;
        reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
        reviews.reviewCount = reviewCount;
    }
    return reviews;
};