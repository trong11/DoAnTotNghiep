const PasswordResetToken = require('../models/passwordResetToken');
const {sendError} = require("../utils/helper");
const {isValidObjectId} = require("mongoose");

exports.isValidPassResetToken = async (req, res, next) => {
   const {token, userId} = req.body;

   if(!token.trim() || !isValidObjectId(userId)) return sendError(res, 'Invalid request!!')

   const resetToken = await PasswordResetToken.findOne({owner: userId});
   if(!resetToken) return sendError(res, 'Unauthorized access, Invalid request!!')

   const matched = await resetToken.compareToken(token);
   if(!matched) return sendError(res, 'Unauthorized access, Invalid request!!')

    req.resetToken = resetToken;

    next();
}