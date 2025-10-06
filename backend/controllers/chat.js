import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config({});

// Lightweight website FAQ/context to ground the model
const SITE_FAQ = `
Website: MERN Job Portal
Main areas:
- Home, Jobs (browse/filter), Job Description, Saved, Profile, Messages
- Auth: Login, Signup; Roles: candidate and employer
- Employer admin: Companies, Create Company, Post Job, Admin Jobs, Applicants, Admin Messages

Common tasks:
- How to apply: Login as candidate -> open a job -> click "Apply" button -> upload resume (Profile -> resume) if prompted -> confirm submission. View your applications under Profile or Saved/Applied Jobs pages if available.
- How to post a job: Login as employer -> Admin -> Companies (create/setup company if missing) -> Admin Jobs -> Post Job -> fill title, description, location, salary, type, and publish. You can later update it in Admin Jobs.
- Reset password: If app lacks email reset UI, instruct user to login with existing creds or contact support; otherwise use "Forgot password" on Login page (if present). Never claim an email was sent unless you can.
- Update profile: Profile -> edit personal info, bio, skills, and upload resume.
- Save a job: On a job card/description, use "Save"; access in Saved page.
- Messaging: Candidates and employers can chat under Messages/Admin Messages.
Guidelines: Be concise, reference button labels and page names, and give step-by-step instructions. If a feature is not implemented, suggest contacting support from the site header/footer.
`;

function faqFallbackAnswer(userText = "") {
    const q = (userText || "").toLowerCase();
    const help = (title, steps) => `${title}\n\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;

    if (/(how|where).*(apply|application)/.test(q)) {
        return help("How to apply to a job", [
            "Login or Signup as a candidate",
            "Open the Jobs page and choose a role",
            "Click the job to open its description",
            "Press the Apply button",
            "Upload/confirm your resume and submit"
        ]);
    }
    if (/(post|create).*(job)/.test(q)) {
        return help("How to post a job (employer)", [
            "Login as employer",
            "Open Admin > Companies and create/setup your company",
            "Go to Admin > Post Job",
            "Fill in title, description, location, salary, type",
            "Publish and manage it in Admin Jobs"
        ]);
    }
    if (/(reset|forgot).*(password)/.test(q)) {
        return help("Password help", [
            "Open the Login page",
            "Use 'Forgot password' if available",
            "If not present, contact support or an admin to reset",
            "After reset, login and update profile if needed"
        ]);
    }
    if (/(update|edit).*(profile|resume|skills)/.test(q)) {
        return help("Update profile", [
            "Go to Profile",
            "Edit personal info, bio, and skills",
            "Upload your resume",
            "Save changes"
        ]);
    }
    if (/(save).*(job)|saved jobs?/.test(q)) {
        return help("Save a job", [
            "From job cards or description, click Save",
            "Open the Saved page to review later"
        ]);
    }
    if (/(message|chat|contact).*(employer|candidate|support)/.test(q)) {
        return help("Messaging", [
            "Open Messages (for candidates) or Admin Messages (for employers)",
            "Select a conversation and type your message"
        ]);
    }
    return "I'm your Job Portal assistant. I can help you navigate the site, apply to jobs, post roles, reset passwords, update your profile, and more. Try asking: 'How to apply?', 'How to post a job?', or 'How to update profile?'";
}

// POST /api/chat
// Body: { messages: [{ role: 'system'|'user'|'assistant', content: string }], userId?: string }
export const chatWithAI = async (req, res) => {
    try {
        const { messages = [], userId } = req.body || {};

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            const lastUser = [...messages].reverse().find(m => m.role === "user");
            const reply = faqFallbackAnswer(lastUser?.content || "");
            return res.status(200).json({ success: true, message: reply, role: "assistant" });
        }

        const openai = new OpenAI({ apiKey });

        // system prompt tailored for a job portal support bot
        const systemPrompt = {
            role: "system",
            content:
                `You are an AI support assistant for a MERN Job Portal. Use the provided site FAQ/context to answer accurately. Be concise, friendly, and provide step-by-step guidance for tasks like creating an account, posting a job, applying to jobs, resetting password, updating profile, saving jobs, and navigating the site. Reference exact UI labels like "Post Job", "Login", "Signup", "Profile", "Saved". If a feature seems unavailable, state that clearly and suggest contacting support. Do not invent user-specific or database data.

Context:\n${SITE_FAQ}`
        };

        // Trim context to last 20 turns to control token usage
        const clipped = messages.slice(-40);
        const chatMessages = [systemPrompt, ...clipped];

        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: chatMessages,
            temperature: 0.4,
            max_tokens: 600,
            user: userId || undefined
        });

        const choice = response?.choices?.[0]?.message;
        if (!choice) {
            return res.status(500).json({ success: false, message: "No response from model" });
        }

        return res.status(200).json({
            success: true,
            message: choice.content,
            role: choice.role || "assistant"
        });
    } catch (error) {
        console.error("/api/chat error:", error);
        const message = error?.response?.data?.error?.message || error.message || "Unexpected error contacting AI service";
        return res.status(500).json({ success: false, message });
    }
};

export default chatWithAI;


