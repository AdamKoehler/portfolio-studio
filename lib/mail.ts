import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

//const domain = "http://localhost:3000"; // For local development
const domain = "https://portfolio-studio-kappa.vercel.app"; // Remove trailing slash

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmationLink = `${domain}/auth/verify-email?token=${token}`

    try {
        const { data, error } = await resend.emails.send({
            from: "Portfolio Studio <onboarding@resend.dev>", // Add a friendly name
            to: email,
            subject: "Please verify your email address",
            html: `
            <h1>Verify your email address</h1>
            <p>Click <a href="${confirmationLink}">here</a> to verify your email address</p>
            `
        });

        if (error) {
            console.error('Resend error:', error);
            throw error;
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
}