import { Application } from "../models/applicationModel.js";
import { Job } from "../models/jobModel.js";

// candidate can apply job
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required.",
        success: false
      });
    }

    // check if the user has already applied for the job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this jobs",
        success: false
      });
    }

    // check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      });
    }

    // create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "Job applied successfully.",
      success: true
    });

  } catch (error) {
    console.log(error);
  }
};

//candidate can get all the jobs he applied
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'job',
        options: { sort: { createdAt: -1 } },
        populate: {
          path: 'company',
          options: { sort: { createdAt: -1 } }
        }
      });

    if (!application || application.length === 0) {
      return res.status(404).json({
        message: "No Applications",
        success: false
      });
    }

    return res.status(200).json({
      application,
      success: true
    });

  } catch (error) {
    console.log(error);
    
  }
};

//recruiter get all the applicants of a particular job
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: 'applications',
      options: { sort: { createdAt: -1 } },
      populate: {
        path: 'applicant'
      }
    });

    if (!job) {
      return res.status(404).json({
        message: 'Job not found.',
        success: false
      });
    }

    return res.status(200).json({
      job,
      success: true
    });

  } catch (error) {
    console.log(error);
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationID = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: 'status is required',
        success: false
      });
    }

    // find the application by application id
    const application = await Application.findOne({ _id: applicationID });
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false
      });
    }

    // update the status
    application.status = status.toLowerCase();
    await application.save();

    // If candidate is accepted/shortlisted, ensure conversation exists and notify
    if (application.status === 'accepted') {
      try {
        // Lazy import to avoid circular deps at top
        const { default: Conversation } = await import('../models/conversationModel.js');
        const { default: Message } = await import('../models/messageModel.js');

        // Fetch job to get recruiter/creator
        const job = await Job.findById(application.job);
        if (job) {
          const recruiterId = job.created_by;
          const candidateId = application.applicant;

          // Find or create conversation scoped to this job and participants
          let conversation = await Conversation.findOne({
            participants: { $all: [candidateId, recruiterId] },
            job: job._id
          });

          if (!conversation) {
            conversation = new Conversation({
              participants: [candidateId, recruiterId],
              job: job._id
            });
            await conversation.save();
          }

          // Seed an initial notification message from recruiter
          const notificationText = `You have been shortlisted for ${job.title}. You can chat with the recruiter here.`;
          const initialMessage = new Message({
            conversation: conversation._id,
            sender: req.id || recruiterId,
            content: notificationText
          });
          await initialMessage.save();
          conversation.lastMessage = initialMessage._id;
          await conversation.save();
        }
      } catch (notifyErr) {
        console.log('Error creating conversation/notification after acceptance:', notifyErr);
      }
    }

    return res.status(200).json({
      message: "Status updated successfully.",
      success: true
    });

  } catch (error) {
    console.log(error);
  }
};
