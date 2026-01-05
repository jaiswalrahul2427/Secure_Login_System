const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const generatePassword = require("../utils/passwordGenerator");

const router = express.Router();

/* =========================
   CREATE PROFILE (REGISTER)
   ========================= */
router.post("/register", async(req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            phone,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "Profile created successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;