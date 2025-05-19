const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { User } = require('../models');

const registerSchema =  Joi.object({
            firstname: Joi.string().required().messages({
                'string.empty': 'firstname cannot be empty',
            }),
            lastname: Joi.string().required().messages({
                'string.empty': 'lastname cannot be empty',
            }),
            mobile: Joi.string().required().messages({
                'string.empty': 'Mobile cannot be empty',
            }),
            email: Joi.string().email().required().messages({
                'string.email': 'Email must be a valid email address',
                'any.required': 'Email cannot be empty',
            }),
            password: Joi.string().min(8).pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)).required().messages({
                'string.min': 'The entered password should be at least 8 characters long',
                'string.pattern.base': 'The password must contain at least 1 special character, 1 uppercase, 1 lowercase, 1 numeric character, and no white spaces',
                'any.required': 'Password cannot be empty',
            }),
            confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
                'any.only': 'Password and Confirm Password do not match',
                'any.required': 'Confirm Password cannot be empty',
            })
        });

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email cannot be empty',
    }),
    password: Joi.string().min(8).pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)).required().messages({
        'string.min': 'The entered password should be at least 8 characters long',
        'string.pattern.base': 'The password must contain at least 1 special character, 1 uppercase, 1 lowercase, 1 numeric character, and no white spaces',
        'any.required': 'Password cannot be empty',
    })
})

exports.register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password ,firstname,lastname,mobile} = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.log('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {

    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.log('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};
