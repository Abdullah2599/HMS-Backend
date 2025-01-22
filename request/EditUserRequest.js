const { body, validationResult } = require('express-validator');

class EditUserRequest {
  static validationRules() {
    const rules = [
      body('username').optional().isString().withMessage('Name must be a string'),
      body('contact').optional()
      .isString().withMessage("Contact must be a string"),  
      body('newpassword').optional()
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/, "i")
      .withMessage('Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one digit, and one special character.')
    ];
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
module.exports = EditUserRequest;
