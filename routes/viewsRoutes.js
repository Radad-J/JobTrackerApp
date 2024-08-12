const express = require("express");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

const Job = require("../models/Job");
router.get("/jobDetails/:id", async (req, res) => {
  res.locals.job = await Job.findById(req.params.id);
  res.render("jobDetails");
});

router.get("/addJob", (req, res) => {
  res.render("addJob");
});

router.get("/updateJob/:id", async (req, res) => {
  res.locals.job = await Job.findById(req.params.id);
  res.render("updateJob");
});

router.get("/profile", (req, res) => {
  res.render("profile");
});

router.get("/updateProfile", (req, res) => {
  res.render("updateProfile");
});

router.get("/register", (req, res) => {
  res.render("register");
});

module.exports = router;
