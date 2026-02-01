const express = require("express");
const router = express.Router();
const { 
    createGarage, 
    getGarages, 
    getGarageById, 
    updateGarage, 
    deleteGarage,
    getMyGarages,
    searchGarages
} = require("../controllers/garageController");
const protect = require("../middlewares/protect");
const checkRole = require("../middlewares/checkRole");
// Public routes
router.get("/", getGarages);
router.get("/search", searchGarages);
router.get("/:id", getGarageById);

// Protected routes
router.post("/", protect, checkRole(["garageOwner", "admin"]), createGarage);
router.get("/my/garages", protect, checkRole(["garageOwner"]), getMyGarages);
router.put("/:id", protect, checkRole(["garageOwner", "admin"]), updateGarage);
router.delete("/:id", protect, checkRole(["garageOwner", "admin"]), deleteGarage);

module.exports = router;