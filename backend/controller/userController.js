import bcrypt from 'bcryptjs';
import { User } from '../models/UserModel.js'
import { createToken } from '../middleware/auth.js';
import speakeasy from 'speakeasy'
import qrcode from 'qrcode';

export const registerUser = async (req, res) => {
    const { email, password, username } = req.body;
    try {

        if (!email || !password || !username) {
            return res.status(404).json({
                message: 'Send all required fields'
            });
        }

        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPass
        });
        await newUser.save();

        const token = createToken(newUser);

        return res.status(201).json({
            message: "New user registered",
            token,
            user: newUser
        });
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).json({ message: err.message });
    }
}

export const userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password)
            return res.status(404).json("Send both email and password");

        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).json("No User Found!")

        const isPassword = await bcrypt.compare(password, user.password);

        if (!isPassword)
            return res.status(400).json("Invalid Password");

        const token = createToken(user);

        return res.status(200).json({
            message: "Credentials verified",
            token,
            user,
            mfaRequired: user.mfaEnabled
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json("Server Error: " + err);
    }
}

export const verifyMFA = async (req, res) => {
    const userId = req.userId;
    const { otp } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user)
            return res.status(400).json("No User Found!");

        const verified = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: "base32",
            token: otp,
            window: 1
        });

        if (!verified)
            return res.status(400).json("Invalid Authentication OTP");

        const token = createToken(user);
        return res.status(200).json({
            message: "Credential Verified",
            user,
            token
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json("Server Error: " + err)
    }
}

export const verifyPassword = async (req, res, next) => {
    const userId = req.userId;
    const { password } = req.body;
    const user = await User.findById(userId);
    if (!user)
        return res.status(400).json("Sorry! No User Found.");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        return res.status(400).json("Invalid Password");

    res.status(200).json({
        message: "User verified",
        verified: true
    });
    next();
}

export const setupMfaHandler = async (req, res, next) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user)
            return res.status(400).json("Sorry! No User Found.");

        if (user.mfaEnabled) {
            return res.status(400).json({ error: "MFA is already enabled" });
        }

        // Generate TOTP secret
        const secret = speakeasy.generateSecret({
            name: `MyApp (${user.email})`, // This appears in Google Authenticator
        });

        // Save secret temporarily to user's record (only after verification we'll enable MFA)
        user.mfaTempSecret = secret.base32;
        await user.save();

        // Generate QR code as base64
        const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url);

        return res.status(200).json({
            qrCode: qrCodeDataURL,
            secret: secret.base32, // Optional: send only in dev
        });
    } catch (err) {
        console.error("Error setting up MFA:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const refreshUser = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId);
        if (!user)
            return res.status(400).json("Sorry! No User Found.");

        const token = createToken(user);
        return res.status(200).json({ token, user });
    } catch (error) {
        console.error("Error setting up MFA:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const verifyMfaSetupHandler = async (req, res) => {
    try {
        const { token } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user || !user.mfaTempSecret) {
            return res.status(400).json({ error: "MFA setup not initiated" });
        }

        const isVerified = speakeasy.totp.verify({
            secret: user.mfaTempSecret,
            encoding: "base32",
            token,
            window: 1, // allow +/- 30 seconds
        });

        if (!isVerified) {
            return res.status(400).json({ error: "Invalid TOTP" });
        }

        // Finalize MFA setup
        user.mfaSecret = user.mfaTempSecret;
        user.mfaTempSecret = undefined;
        user.mfaEnabled = true;
        await user.save();

        return res.status(200).json({ message: "MFA enabled successfully" });
    } catch (err) {
        console.error("MFA verify error:", err);
        return res.status(500).json({ error: "Server error" });
    }
}

export const disableMfaHandler = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user || !user.mfaEnabled) {
            return res.status(400).json({ error: "MFA is not enabled" });
        }

        // Disable MFA
        user.mfaSecret = undefined;
        user.mfaEnabled = false;
        await user.save();

        return res.status(200).json({ message: "MFA disabled successfully" });
    } catch (err) {
        console.error("Disable MFA error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}