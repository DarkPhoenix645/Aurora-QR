import qrcode from "qrcode"
import path from 'path'
import User from "../models/User.js"

async function signup_post (req, res) {
    let type = 0
    const { name, email, phone, gender, college, city, dob, password, invite } = req.body
    if (invite == 65535) { type = "admin" }
    else { type = "user" }

    try {
        const newUser = await User.create({ name, email, phone, gender, college, city, password, dob, type });
        try {
            await newUser.save();
            console.info("New user created and saved successfully");
            console.info(newUser);

            let id = newUser.id;
            await qrcode.toFile(path.resolve(`src/tmp/${ id }.png`), id, 
            { 
                type: "png", 
                color: {
                    dark: "#000000",
                    light: "#FFFFFF"
                } 
            }, 
            (err) => {
                if (err) { logger.error(err) }
                else { 
                    console.info("QR Generated Successfully")
                    res.sendFile(path.resolve(`src/tmp/${ id }.png`)) 
                }
            })
        } catch(err) {
            console.error(err);
            res.status(400).json({ errors: JSON.stringify(err.message) });
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({ errors: JSON.stringify(err.message) });
    }
}

async function verify (req, res) {
    const { id, adminId } = req.body

    try {
        const admin = await User.findById(adminId);

        if (admin && admin.type == "admin") {
            const user = await User.findById(id);
            if (user) {
                res.status(200).json({ "message": "User verified", "user": user });
                console.info(`User verified: ${ user }`);
            }
            else { res.status(404).json({ "errors": { "message": "User not found" } }); }
        }
        else { res.status(400).json({ "errors": { "message": "Invalid Admin ID" } }); }
    } catch (err) {
        console.error(err)
        res.status(500).json({ "errors": { "message": "Internal Server Error" } });
    }
}

export default {
    signup_post,
    verify
}