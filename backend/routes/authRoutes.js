const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const generatePassword = require("../utils/passwordGenerator");

const router = express.Router();

/* REGISTER */
router.post("/register", async(req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            phone,
            password: hashed
        });

        await newUser.save();
        res.status(201).json({ message: "Profile created successfully" });

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

/* FORGOT PASSWORD */
router.post("/forgot-password", async(req, res) => {
    try {
        const { emailOrPhone } = req.body;
        if (!emailOrPhone) {
            return res.status(400).json({ message: "Email or phone is required" });
        }

        const user = await User.findOne({
            $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.lastPasswordReset) {
            const diff = Date.now() - user.lastPasswordReset.getTime();
            const oneDay = 24 * 60 * 60 * 1000;
            if (diff < oneDay) {
                return res.status(429).json({
                    message: "Forgot password only once per day"
                });
            }
        }

        const newPass = generatePassword();
        const hashed = await bcrypt.hash(newPass, 10);

        user.password = hashed;
        user.lastPasswordReset = new Date();
        await user.save();

        console.log("NEW PASSWORD:", newPass);
        res.json({
            message: "New password generated"
        });

    } catch (err) {
        console.error("FORGOT PASSWORD ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;