const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor");

router.get("/visitor", async (req, res) => {
    try {
        const visitor = await Visitor.findById("6a5f9e43fbf863147fdc4ce0");

        res.json({
            success: true,
            data: visitor
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router;