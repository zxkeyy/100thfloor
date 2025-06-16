import nodemailer from "nodemailer";

export interface EmailConfig {
  from: string;
  to: string;
  subject: string;
  html: string;
}

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Optional: additional SMTP options
    tls: {
      // Do not fail on invalid certs (for development)
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
  });
};

export const sendVerificationEmail = async (email: string, code: string) => {
  try {
    const transporter = createTransporter();

    const mailOptions: EmailConfig = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@100thfloor.com",
      to: email,
      subject: "100th Floor - Verify Your Blog Post Submission",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">100th Floor</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Blog Post Verification</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #333; margin-top: 0;">Verify Your Email Address</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Thank you for submitting a blog post to 100th Floor! To complete your submission, 
              please verify your email address using the verification code below:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; border: 2px dashed #667eea;">
              <p style="margin: 0; color: #666; font-size: 14px;">Your Verification Code:</p>
              <h1 style="margin: 10px 0; color: #667eea; font-size: 32px; letter-spacing: 4px; font-weight: bold;">${code}</h1>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              This code will expire in <strong>10 minutes</strong>. If you didn't submit a blog post, 
              you can safely ignore this email.
            </p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>Note:</strong> Your blog post will be reviewed by our team before being published.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px;">
            <p>© 2025 100th Floor. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};

export const generateVerificationCode = (): string => {
  return Math.random().toString().substring(2, 8).padStart(6, "0");
};
