export const USER_API_ENDPOINT = "https://jobportal-y1np.onrender.com/api/v1/user"
export const JOB_API_ENDPOINT = "https://jobportal-y1np.onrender.com/api/v1/job"
export const COMPANY_API_ENDPOINT = "https://jobportal-y1np.onrender.com/api/v1/company"
export const APPLICATION_API_ENDPOINT = "https://jobportal-y1np.onrender.com/api/v1/application"

// export const USER_API_ENDPOINT = "http://localhost:8000/api/v1/user";
// export const JOB_API_ENDPOINT = "http://localhost:8000/api/v1/job";
// export const COMPANY_API_ENDPOINT = "http://localhost:8000/api/v1/company";
// export const APPLICATION_API_ENDPOINT = "http://localhost:8000/api/v1/application";

export const stripHtmlTags = (htmlString) => {
    if (!htmlString) return '';
    // Remove HTML tags and decode HTML entities
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent || tempDiv.innerText || '';
};



