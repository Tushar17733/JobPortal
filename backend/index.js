import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv"
dotenv.config({})
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.js"
import companyRoute from "./routes/company.js"
import jobRoute from "./routes/job.js"
import applicationRoute from "./routes/application.js"
import path from "path";

const app = express();

// builtin-middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const corsOptions = {
    origin: 'https://jobportal-y1np.onrender.com',
    credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;
const _dirname = path.resolve()

app.use("/api/v1/user", userRoute)
app.use("/api/v1/company", companyRoute)
app.use("/api/v1/job", jobRoute)
app.use("/api/v1/application", applicationRoute)

app.use(express.static(path.join(_dirname, "/frontend/dist")))
app.get('/', (_, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"))
})

app.listen(PORT, () => {
    connectDB()
    console.log(`Server running at port ${PORT}`);
});
