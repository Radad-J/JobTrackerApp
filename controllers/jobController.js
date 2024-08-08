const Job = require("../models/Job");
const { errorHandler } = require("../middleware/errorHandler");
const { Mongoose } = require("mongoose");

const createJob = async (req, res) => {
  const {
    title,
    website,
    contactName,
    contactEmail,
    contactPhone,
    address,
    origin,
    status,
    comments,
  } = req.body;

  try {
    const job = await Job.create({
      user: req.user._id,
      title,
      website,
      contactName,
      contactEmail,
      contactPhone,
      address,
      origin,
      status,
      comments,
    });

    res.status(201).json(job);
  } catch (err) {
    const errors = errorHandler(err);
    res.status(400).json({ errors });
  }
};

const getJobs = async (req, res) => {
  try {
    const { page = 1, limit = 6, filterBy, orderBy = "asc" } = req.query;
    console.log(page);

    // Initialize query
    let query = { user: req.user._id };

    // Apply filtering
    if (filterBy === "status") {
      if (req.query.filterValue) {
        query.status = req.query.filterValue;
      }
    } else if (filterBy === "createdAt") {
      query.createdAt = { $exists: true }; // This ensures we're querying by creation date
    }

    // Determine sort order
    const sortField = filterBy === "createdAt" ? "createdAt" : "status";
    const sortOrder = orderBy === "desc" ? -1 : 1;

    // Fetch jobs with pagination, filtering, and sorting
    const jobs = await Job.find(query)
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get total count of jobs for pagination
    const totalJobs = await Job.countDocuments(query);

    res.json({
      jobs,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalJobs / limit),
      totalJobs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (job && job.user.equals(req.user._id)) {
      res.json(job);
    } else {
      res
        .status(404)
        .json({ errors: [{ path: "general", message: "Job not found" }] });
    }
  } catch (err) {
    const errors = errorHandler(err);
    res.status(400).json({ errors });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (job && job.user.equals(req.user._id)) {
      job.title = req.body.title || job.title;
      job.website = req.body.website || job.website;
      job.contactName = req.body.contactName || job.contactName;
      job.contactEmail = req.body.contactEmail || job.contactEmail;
      job.contactPhone = req.body.contactPhone || job.contactPhone;
      job.address = req.body.address || job.address;
      job.origin = req.body.origin || job.origin;
      job.status = req.body.status || job.status;
      job.comments = req.body.comments || job.comments;

      const updatedJob = await job.save();
      res.json(updatedJob);
    } else {
      res
        .status(404)
        .json({ errors: [{ path: "general", message: "Job not found" }] });
    }
  } catch (err) {
    const errors = errorHandler(err);
    res.status(400).json({ errors });
  }
};

const deleteJob = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Job.deleteOne({ _id: id });
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob };
