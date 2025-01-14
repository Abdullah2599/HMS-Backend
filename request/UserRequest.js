const { body, validationResult } = require('express-validator');
const User = require('../models/User'); // Adjust the path as necessary
class UserRequest {
  static validationRules(update=false) {
    const rules = [
      body('username').isString().withMessage('Name must be a string'),
      body('email')
        .isEmail().withMessage('Email must be a valid email address')
        .custom(async (value, { req }) => {
          const user = await User.findOne({ email: value });
          if (user) {
            if(update && req.params.id === user._id.toString()){
              return;
            }
            return Promise.reject('Email already in use');
          }
        }),  
    ];
    if (!update) {
        rules.push(
            body('password')
              .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/, "i")
              .withMessage('Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one digit, and one special character.')
          );
             }
    return rules;
  }
  static validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
}
module.exports = UserRequest;
