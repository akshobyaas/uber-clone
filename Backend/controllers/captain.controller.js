// D:\uber-clone\Backend\controllers\captain.controller.js

const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');

module.exports.registerCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password, vehicle } = req.body;

        const isCaptainAlreadyExist = await captainModel.findOne({ email });
        if (isCaptainAlreadyExist) {
            return res.status(409).json({ message: 'Captain already exists' });
        }

        const hashedPassword = await captainModel.hashPassword(password);

        // --- THIS IS THE FIX ---
        // We use the spread syntax (...) to unpack the vehicle object.
        // This provides all the properties (color, plate, etc.) that your service needs.
        const captain = await captainService.createCaptain({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword,
            ...vehicle 
        });

        const token = captain.generateAuthToken();
        res.status(201).json({ token, captain });

    } catch (error) {
        console.error("Error in registerCaptain:", error);
        next(error); // Pass error to your global error handler
    }
};