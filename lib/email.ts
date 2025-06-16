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

export const sendAdminNotification = async (postData: { title: string; authorName: string; authorEmail: string; authorPhoneNumber?: string; content: string; postId: string }) => {
  try {
    const transporter = createTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

    if (!adminEmail) {
      console.warn("No admin email configured. Skipping admin notification.");
      return { success: false, error: "No admin email configured" };
    }

    // Truncate content for email preview (first 200 characters)
    const contentPreview = postData.content.replace(/<[^>]*>/g, "").substring(0, 200) + (postData.content.length > 200 ? "..." : "");

    const mailOptions: EmailConfig = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@100thfloor.com",
      to: adminEmail,
      subject: `New Blog Post Submission - "${postData.title}"`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">100th Floor</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">New Blog Post Submission</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #333; margin-top: 0;">New Post Requires Review</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              A new blog post has been submitted and is awaiting your review and approval.
            </p>
            
            <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
              <h3 style="margin: 0 0 15px 0; color: #333; font-size: 20px;">${postData.title}</h3>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">Author:</strong> ${postData.authorName}<br>
                <strong style="color: #555;">Email:</strong> ${postData.authorEmail}
                ${postData.authorPhoneNumber ? `<br><strong style="color: #555;">Phone:</strong> ${postData.authorPhoneNumber}` : ""}
              </div>
              
              <div style="margin-bottom: 20px;">
                <strong style="color: #555;">Content Preview:</strong>
                <p style="color: #666; font-style: italic; margin: 8px 0 0 0; padding: 15px; background: #f8f9fa; border-radius: 5px;">
                  "${contentPreview}"
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 25px;">
                <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/admin" 
                   style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Review in Admin Dashboard
                </a>
              </div>
            </div>
            
            <div style="background: #e3f2fd; border: 1px solid #2196f3; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p style="margin: 0; color: #1976d2; font-size: 14px;">
                <strong>Action Required:</strong> Please review this post in your admin dashboard to approve or reject it for publication.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px;">
            <p>© 2025 100th Floor. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">This is an automated notification. Do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending admin notification email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};

export const sendAdminCommentNotification = async (commentData: { content: string; postTitle: string; postSlug: string; commentId: string }) => {
  try {
    const transporter = createTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

    if (!adminEmail) {
      console.warn("No admin email configured. Skipping admin comment notification.");
      return { success: false, error: "No admin email configured" };
    }

    // Truncate comment content for email preview (first 150 characters)
    const contentPreview = commentData.content.substring(0, 150) + (commentData.content.length > 150 ? "..." : "");

    const mailOptions: EmailConfig = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@100thfloor.com",
      to: adminEmail,
      subject: `New Comment on "${commentData.postTitle}"`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">100th Floor</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">New Comment Submission</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #333; margin-top: 0;">New Comment Requires Review</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              A new comment has been submitted on the blog post "<strong>${commentData.postTitle}</strong>" and is awaiting your review.
            </p>
            
            <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #4CAF50;">
              <div style="margin-bottom: 20px;">
                <strong style="color: #555;">Comment:</strong>
                <p style="color: #666; margin: 8px 0 0 0; padding: 15px; background: #f8f9fa; border-radius: 5px;">
                  "${contentPreview}"
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 25px;">
                <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/admin" 
                   style="display: inline-block; background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">
                  Review in Admin Dashboard
                </a>
                <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/blog/${commentData.postSlug}" 
                   style="display: inline-block; background: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  View Blog Post
                </a>
              </div>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>Action Required:</strong> Please review this comment in your admin dashboard to approve or reject it.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px;">
            <p>© 2025 100th Floor. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">This is an automated notification. Do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending admin comment notification email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};
