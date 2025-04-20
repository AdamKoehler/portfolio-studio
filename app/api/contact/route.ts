import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getUserByUsername, getUserById } from '@/data/user';
const resend = new Resend(process.env.RESEND_API_KEY);

/*
User fills out the contact form
Form data is sent here with parameter names
API finds the portfolio owner's email
Email is sent using Resend
Success/error response is properly returned to the frontend for visitor success/error message
*/

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { fromEmail, message, toUsername} = await request.json();
    const portfolioOwner = await getUserByUsername(toUsername);
    if (!portfolioOwner) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    } else {
      const ownerUser = await getUserById(portfolioOwner);
      const ownerEmail = ownerUser?.email ?? '';
    
      if (ownerEmail === '') {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        ); // last check to make sure the toEmail field is not empty
      }
      // Send email using Resend
      const data = await resend.emails.send({
        from: 'Portfolio Contact <contact@3dportfol.io>',
        to: ownerEmail,
        subject: `New message from ${fromEmail} - Portfolio Contact`,
        html: `
          <div>
            <h2>New message from your portfolio visitor</h2>
            <p><strong>From:</strong> ${fromEmail}</p>
            <p><strong>Message:</strong></p>
            <div style="white-space: pre-wrap; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">
              ${message}
            </div>
            <p style="margin-top: 20px; font-size: 12px;">
              This message was sent through your portfolio about me page.
            </p>
          </div>
        `,
      });

      return NextResponse.json({ success: true, data });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 