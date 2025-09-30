// export const USER_API_ENDPOINT = "https://jobportal-y1np.onrender.com/api/v1/user"
// export const JOB_API_ENDPOINT = "https://jobportal-y1np.onrender.com/api/v1/job"
// export const COMPANY_API_ENDPOINT = "https://jobportal-y1np.onrender.com/api/v1/company"
// export const APPLICATION_API_ENDPOINT = "https://jobportal-y1np.onrender.com/api/v1/application"

export const USER_API_ENDPOINT = "http://localhost:8000/api/v1/user";
export const JOB_API_ENDPOINT = "http://localhost:8000/api/v1/job";
export const COMPANY_API_ENDPOINT = "http://localhost:8000/api/v1/company";
export const APPLICATION_API_ENDPOINT = "http://localhost:8000/api/v1/application";

export const stripHtmlTags = (htmlString) => {
    if (!htmlString) return '';
    // Remove HTML tags and decode HTML entities
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent || tempDiv.innerText || '';
};



// Popular Indian cities for location filter (30+)
// export const POPULAR_INDIAN_CITIES = [
//     "Mumbai",
//     "Delhi",
//     "Bengaluru",
//     "Bangalore",
//     "Hyderabad",
//     "Ahmedabad",
//     "Chennai",
//     "Kolkata",
//     "Surat",
//     "Pune",
//     "Jaipur",
//     "Lucknow",
//     "Kanpur",
//     "Nagpur",
    
// ];

// export const JOB_TYPES = ["Full-Time", "Part-Time", "Internship", "Remote"];

// export const EXPERIENCE_LEVELS = [
//     { value: "fresher", label: "Fresher (0–2 yrs)" },
//     { value: "senior", label: "Senior (2+ yrs)" }
// ];

// export const SALARY_RANGES_LPA = [
//     { value: "0-5", label: "0–5 LPA" },
//     { value: "5-10", label: "5–10 LPA" },
//     { value: "10+", label: "10+ LPA" }
// ];

// export const POSTED_DATE_OPTIONS = [
//     { value: "24h", label: "Last 24 hours" },
//     { value: "7d", label: "Last 7 days" },
//     { value: "30d", label: "Last 30 days" },
//     { value: "any", label: "Anytime" }
// ];