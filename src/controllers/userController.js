import qrcode from "qrcode"
import path from 'path'
import User from "../models/User.js"

async function signup_post (req, res) {
    let type = 0
    const { name, email, phone, gender, college, city, dob, password, invite } = req.body
    if (invite == 65535) { type = "admin" }

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
    const id = req.body.id

    try {
        let user = await User.findById(id);
        if (user) { 
            res.status(200).json("User verified!");
            console.info(`User verified: ${ user }`); 
        }
        else { throw Error }
    } catch (err) {
        res.status(400).json( "User not found" );
    }
}

export default {
    signup_post,
    verify
}