const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'debfn35m1',
    api_key: '346622563969532',
    api_secret: '8YiobSeWNE5sDw8pSRipUuuSi54',
    secure: true
});

module.exports = cloudinary;