const mongoose = require('mongoose');
const validator = require('validator');

const jobSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'User is required'] },
    title: { 
        type: String,
        required: [true, 'Title is required'] 
    },
    website: { 
        type: String,
        validate: {
            validator: validator.isURL,
            message: 'Website must be a valid URL'
        }
    },
    contactName: { type: String },
    contactEmail: { 
        type: String,
        validate: {
            validator: validator.isEmail,
            message: 'Contact email must be a valid email address'
        }
    },
    contactPhone: { 
        type: String,
        validate: {
            validator: function(value) {
                // Custom phone number validation (optional)
                return /^[\d\+\-\(\)\s]+$/.test(value);
            },
            message: 'Contact phone number is invalid'
        }
    },
    address: { type: String },
    origin: { 
        type: String, 
        enum: {
            values: ['Candidature spontanée', 'Job offer'],
            message: 'Origin must be either "Candidature spontanée" or "Job offer"'
        },
        required: [true, 'Origin is required']
    },
    status: { 
        type: String, 
        enum: {
            values: ['Interested', 'CV sent', 'Negative', 'Interview'],
            message: 'Status must be one of "Interested", "CV sent", "Negative", or "Interview"'
        },
        required: [true, 'Status is required']
    },
    comments: { type: String },
}, {
    timestamps: true
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
