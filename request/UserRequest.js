const { body, validationResult } = require('express-validator');
const User = require('../models/User'); // Adjust the path as necessary
const user = require('../models/User');
class UserRequest {
  static validationRules(update=false) {
    const rules = [
      body('username').isString().withMessage('Name must be a string'),
      body('CNIC').optional().isString().withMessage("CNIC must be a string").matches(/^\d{5}-\d{7}-\d{1}$/)
      .withMessage("CNIC must be in the format XXXXX-XXXXXXX-X").custom(async (value) => {
        const existingCNIC = await user.findOne({CNIC:value});
        if (existingCNIC) {
          throw new Error("CNIC must be unique");
        }
        return true;
      }),
      body('address')
      .isString().optional().withMessage("Address must be a string")
      .isLength({ min: 5, max: 255 }).withMessage("Address must be between 5 and 255 characters")
      .trim().escape(),
  
    body('contact')
      .isString().withMessage("Contact must be a string"),
      
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
