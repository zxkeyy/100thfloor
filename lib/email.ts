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

export const sendAdminCommentNotification = async (commentData: { authorName: string; content: string; postTitle: string; postSlug: string }) => {
  try {
    const transporter = createTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

    if (!adminEmail) {
      console.warn("No admin email configured for comment notifications");
      return { success: false, error: "No admin email configured" };
    }

    const mailOptions: EmailConfig = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@100thfloor.com",
      to: adminEmail,
      subject: `New Comment on "${commentData.postTitle}" - 100th Floor Blog`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">100th Floor</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">New Comment Notification</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #333; margin-top: 0;">New Comment Received</h2>
            <p style="color: #666; margin-bottom: 20px;">A new comment has been submitted on your blog post:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-top: 0;">Post: ${commentData.postTitle}</h3>
              <p style="color: #666; margin: 10px 0;"><strong>Author:</strong> ${commentData.authorName}</p>
              <p style="color: #666; margin: 15px 0 0 0;"><strong>Comment:</strong></p>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px; border: 1px solid #e9ecef;">
                <p style="margin: 0; color: #333; line-height: 1.5;">${commentData.content}</p>
              </div>
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
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending admin comment notification email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};

export const sendNewsletterWelcomeEmail = async (email: string) => {
  try {
    const transporter = createTransporter();

    // Generate unsubscribe token (in real implementation, get this from database)
    const unsubscribeUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;

    const mailOptions: EmailConfig = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@100thfloor.com",
      to: email,
      subject: "Welcome to 100th Floor Newsletter! 🏢",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">100th Floor</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Welcome to Our Newsletter</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #333; margin-top: 0;">Thank You for Subscribing! 🎉</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Welcome to the 100th Floor community! We're excited to have you on board. You'll now receive our latest updates about:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <ul style="color: #333; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>🏗️ Latest architectural projects and innovations</li>
                <li>🌱 Sustainable building practices and green architecture</li>
                <li>📝 New blog posts from our experts</li>
                <li>🎯 Industry insights and trends</li>
                <li>📅 Upcoming events and webinars</li>
              </ul>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin: 25px 0;">
              We promise to only send you valuable content and never spam your inbox. You can unsubscribe at any time using the link below.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}" 
                 style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">
                Visit Our Website
              </a>
              <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/blog" 
                 style="display: inline-block; background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Read Our Blog
              </a>
            </div>
            
            <div style="background: #e3f2fd; border: 1px solid #bbdefb; padding: 15px; border-radius: 5px; margin-top: 25px;">
              <p style="margin: 0; color: #1565c0; font-size: 14px;">
                <strong>Stay Connected:</strong> Follow us on social media for daily updates and behind-the-scenes content!
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px;">
            <p>© 2025 100th Floor. All rights reserved.</p>
            <p style="margin: 5px 0;">
              You're receiving this email because you subscribed to our newsletter.
              <br>
              <a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">Unsubscribe</a> | 
              <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/privacy" style="color: #666; text-decoration: underline;">Privacy Policy</a>
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending newsletter welcome email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};
