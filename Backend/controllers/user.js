const User = require('../models/user');
const EmailVerificationToken = require('../models/emaiVerificationToken');
const jwt = require('jsonwebtoken');
const {isValidObjectId} = require("mongoose");
const {generateOTP, generateMailTransporter} = require("../utils/mails");
const {sendError, generateRandomByte, uploadImageToCloud} = require("../utils/helper");
const PasswordResetToken = require('../models/passwordResetToken');

exports.create = async (req, res) => {
    const {name, email, password} = req.body;

    const oldUSer = await User.findOne({email});

    if (oldUSer) return sendError(res, "This email is already in use !!!");

    const newUser = new User({name, email, password})

    await newUser.save();

    let OTP = generateOTP();

    const newEmailVerificationToken = new EmailVerificationToken({owner: newUser._id, token: OTP});
    await newEmailVerificationToken.save();

    var transport = generateMailTransporter();

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: newUser.email,
        subject: 'Email Verification',
        html: `
           <p> Your verification OTP</p>
           <h1>${OTP}</h1>
        `
    })

    res.status(201).json({
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        }
    });
}

exports.verifyMail = async (req, res) => {
    const {userId, OTP} = req.body;

    if (!isValidObjectId(userId)) return res.json({error: 'Invalid user ID'});

    const user = await User.findById(userId);
    if (!user) return sendError(res, "user not found !!!", 404);
    if (user.isVerified) sendError(res, "user is already verified !!!");

    const token = await EmailVerificationToken.findOne({owner: user.id});

    if (!token) return sendError(res, "token not found !!!")

    const isMatched = await token.compareToken(OTP);
    if (!isMatched) return sendError(res, "OTP is not matched !!!")

    user.isVerified = true;
    await user.save();

    EmailVerificationToken.findByIdAndDelete(token._id);

    var transport = generateMailTransporter();

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: user.email,
        subject: 'Welcome Email',
        html:
            "<h1>Welcome to our app</h1>"
    })

    const jwtToken = jwt.sign({userId: user._id}, process.env.JWT_SECRECT);

    res.json({
        user: {id: user._id, name: user.name, email: user.email, token: jwtToken, isVerified:user.isVerified, role: user.role},
        message: 'Your email is verified'
    });
}

exports.resendEmailVerificationToken = async (req, res) => {
    const {userId} = req.body;

    const user = await User.findById(userId);
    if (!user) return sendError(res, "user not found !!!")

    if (user.isVerified) sendError(res, "user is already verified !!!")

    const alreadyHasToken = await EmailVerificationToken.findOne({owner: user.id});
    if (alreadyHasToken) return sendError(res, "Only after 1 hour you can request for another token !!!")

    let OTP = generateOTP();

    const newEmailVerificationToken = new EmailVerificationToken({owner: user._id, token: OTP});
    await newEmailVerificationToken.save();

    var transport = generateMailTransporter();

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: user.email,
        subject: 'Email Verification',
        html: `
           <p> Your verification OTP</p>
           <h1>${OTP}</h1>
        `
    })
    res.json({message: 'New OTP has been sent to your email'})
}

exports.forgetPassword = async (req, res) => {
    const {email} = req.body;
    if (!email) return sendError(res, 'email is missing');

    const user = await User.findOne({email});
    if (!user) return sendError(res, 'User not found', 404);

    const alreadyHasToken = await PasswordResetToken.findOne({owner: user._id});
    if (alreadyHasToken) return sendError(res, 'Only after 1 hour you can request for another token');

    const token = await generateRandomByte();
    const newPasswordResetToken = await PasswordResetToken({owner: user._id, token});
    await newPasswordResetToken.save();

    const resetPasswordUrl = `http://localhost:3000/auth/reset-password?token=${token}&id=${user._id}`;

    var transport = generateMailTransporter();

    transport.sendMail({
        from: 'security@reviewapp.com',
        to: user.email,
        subject: 'Reset Password Link',
        html: `
           <p> Click here to reset password</p>
           <a href='${resetPasswordUrl}'>Change password</a>
        `
    });
    res.json({message: 'Link sent to your email'});

}

exports.sendResetPasswordTokenStatus = (req, res) => {
    res.json({valid: true})
};

exports.resetPassword = async (req, res) => {
    const {newPassword, userId} = req.body;

    const user = await User.findById(userId);
    const matched = await user.comparePassword(newPassword);
    if (matched) return sendError(res, 'The new password must be different from the old one');

    user.password = newPassword;
    await user.save();

    await PasswordResetToken.findByIdAndDelete(req.resetToken._id)

    const transport = generateMailTransporter();

    transport.sendMail({
        from: 'security@reviewapp.com',
        to: user.email,
        subject: "Password reset successfully",
        html: `
           <h1> Password Reset Successfully </h1>
           <p> Now you can use the new password </p>
        `,
    });
    res.json({message: 'Password reset successfully, now you can use the new password'})
};

exports.signIn = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email})
    if (!user) return sendError(res, 'Email/Password mismatch');

    const matched = await user.comparePassword(password);
    if (!matched) return sendError(res, 'Email/Password mismatch !');

    const {_id, name, role, isVerified,} = user;

    const jwtToken = jwt.sign({userId: user._id}, process.env.JWT_SECRECT);

    res.json({user: {id: _id, name, email, role, token: jwtToken, isVerified}});
}

