const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authService = require('../services/authService');


exports.register = async (req, res) => {
    try {
        const { name, email, password, role, department, phone } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({
                success: false,
                message: "User Already exists"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);


        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role,
            department,
            phone,
        })
        res.status(201).json({
            success: true,
            message: "User Register Successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};