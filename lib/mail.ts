import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

//const domain = "http://localhost:3000"; // For local development
const domain = "https://www.3dportfol.io/";

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmationLink = `${domain}/auth/verify-email?token=${token}`

    try {
        const { data, error } = await resend.emails.send({
            from: "Portfolio Studio <noreply@portfolio-studio-kappa.vercel.app>",
            to: email,
            subject: "Please verify your email address",
            html: `
            <h1>Verify your email address</h1>
            <p>Click <a href="${confirmationLink}">here</a> to verify your email address</p>
            <p>If you didn't request this email, you can safely ignore it.</p>
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