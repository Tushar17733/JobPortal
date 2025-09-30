import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, getJobCountsByCategory, updateJob } from "../controllers/job.js";

const router = express.Router();

router.route("/post").post(isAuthenticated,postJob);
router.route("/get").get(isAuthenticated,getAllJobs);
router.route("/get/:id").get(isAuthenticated,getJobById)
router.route("/getadminjobs").get(isAuthenticated,getAdminJobs);
router.route("/category-counts").get(getJobCountsByCategory);
router.route("/update/:id").put(isAuthenticated, updateJob);

export default router;