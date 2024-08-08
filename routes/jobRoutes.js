const express = require("express");
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, createJob);
router.get("/dashboard", protect, getJobs);
router.get("/:id", protect, getJobById);
router.patch("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;
