const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const generatePassword = require("../utils/passwordGenerator");

const router = express.Router();

/* =========================
   REGISTER / CREATE PROFILE
   ========================= */
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

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            phone,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({ message: "Profile created successfully" });

    } catch (error) {
        console.error("REGISTER ERROR:", error);
        res.status(500).json({ message: error.message });
    }
});

/* =========================
        FORGOT PASSWORD
   ========================= */
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

        // once per day check
        if (user.lastPasswordReset) {
            const diff = Date.now() - user.lastPasswordReset.getTime();
            const oneDay = 24 * 60 * 60 * 1000;

            if (diff < oneDay) {
                return res.status(429).json({
                    message: "You can reset password only once per day"
                });
            }
        }

        const newPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.lastPasswordReset = new Date();
        await user.save();

        console.log("Generated Password:", newPassword);

        res.json({
            message: "New password generated and sent successfully"
        });

    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;