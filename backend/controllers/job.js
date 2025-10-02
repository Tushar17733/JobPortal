import { Job } from "../models/jobModel.js";

//admin post job
export const postJob = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, jobType, experience, position, companyId, category } = req.body;
    const userId = req.id;

    if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId || !category) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false
      })
    };
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
      category
    });
    
    return res.status(201).json({
      message: "New job created successfully",
      job,
      success: true
    })
  } catch (error) {
    console.log(error);
  }
}

export const getAllJobs = async (req, res) => {
  try {
    //Gets the search keyword from the URL query (like /jobs?keyword=developer).
    const keyword = req.query.keyword || "";
    const category = req.query.category || "";
    const location = req.query.location ? req.query.location.split(",") : [];
    const salaryRanges = req.query.salary ? req.query.salary.split(",") : [];

    // Prepares a MongoDB query to search for jobs:
    // It looks for jobs where either the title or description contains the keyword.
    // $regex is used for partial match (like "contains").
    // $options: "i" makes the search case-insensitive (doesn't care about upper/lowercase).
    const query = {
      $and: [
        {
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ]
        }
      ]
    };

    // Add category filter if provided
    if (category) {
      query.$and.push({ category });
    }

    // Add location filter if provided
    if (location.length > 0) {
      query.$and.push({ location: { $in: location } });
    }

    // Add salary filter if provided
    if (salaryRanges.length > 0) {
      const salaryConditions = salaryRanges.map(range => {
        if (range === "0-5 LPA") {
          return { salary: { $gte: 0, $lte: 5 } };
        } else if (range === "5-10 LPA") {
          return { salary: { $gt: 5, $lte: 10 } };
        } else if (range === "10+ LPA") {
          return { salary: { $gt: 10 } };
        }
        return null;
      }).filter(cond => cond !== null);

      if (salaryConditions.length > 0) {
        query.$and.push({ $or: salaryConditions });
      }
    }

    const jobs = await Job.find(query).populate({
      path: "company"
    }).sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false
      })
    };
    return res.status(200).json({
      jobs,
      success: true
    })
  } catch (error) {
    console.log(error);
  }
}

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path:"applications"
    });
    if (!job) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false
      });
    }

    return res.status(200).json({ job, success: true });

  } catch (error) {
    console.log(error);
  }
}

//for admins to get the jobs they have created
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path:"company",
      createdAt:-1,
    });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false
      });
    }
    return res.status(200).json({
      jobs,
      success: true
    });
  } catch (error) {
    console.log(error);
  }
}

// Get job counts by category
export const getJobCountsByCategory = async (req, res) => {
  try {
    const categories = [
      "IT & Software Development",
      "Mechanical Engineering", 
      "Civil Engineering",
      "Electrical & Electronics",
      "Finance & Accounting",
      "Sales & Marketing",
      "Human Resources (HR)",
      "Education & Training",
      "Business Development"
    ];

    const categoryCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await Job.countDocuments({ category });
        return { category, count };
      })
    );

    return res.status(200).json({
      categoryCounts,
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching category counts",
      success: false
    });
  }
}

// admin update job
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;
    const { title, description, requirements, salary, location, jobType, experience, position, companyId, category } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found.", success: false });
    }

    // ensure only creator can update
    if (String(job.created_by) !== String(userId)) {
      return res.status(403).json({ message: "Not authorized to update this job.", success: false });
    }

    const updatePayload = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(requirements !== undefined && { requirements: Array.isArray(requirements) ? requirements : String(requirements).split(',') }),
      ...(salary !== undefined && { salary: Number(salary) }),
      ...(location !== undefined && { location }),
      ...(jobType !== undefined && { jobType }),
      ...(experience !== undefined && { experienceLevel: Number(experience) }),
      ...(position !== undefined && { position: Number(position) }),
      ...(companyId !== undefined && { company: companyId }),
      ...(category !== undefined && { category })
    };

    const updated = await Job.findByIdAndUpdate(jobId, updatePayload, { new: true });

    return res.status(200).json({ message: "Job updated successfully", job: updated, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to update job", success: false });
  }
}