import { config } from 'dotenv';
    //import sgMail from '@sendgrid/mail'; // Removed SendGrid import
    import Mailjet from 'node-mailjet';

    config();

    //sgMail.setApiKey(process.env.SENDGRID_API_KEY!); // Removed SendGrid API key setting

    interface SendEmailProps {
      to: string;
      subject: string;
      text?: string;
      html?: string;
    }

    export const sendEmail = async ({ to, subject, text, html }: SendEmailProps) => {
      try {
        // Mailjet Implementation
        const mailjet = Mailjet.apiConnect(
          process.env.MAILJET_API_KEY!,
          process.env.MAILJET_API_SECRET!,
        );

        const request = mailjet
          .post('send', { version: 'v3.1' })
          .request({
            Messages: [
              {
                From: {
                  Email: process.env.MAILJET_SENDER_EMAIL!,
                  Name: 'Your App Name', // Replace with your app name
                },
                To: [
                  {
                    Email: to,
                  },
                ],
                Subject: subject,
                TextPart: text,
                HTMLPart: html,
              },
            ],
          });

        await request;
        console.log(\`Email sent to \${to} via Mailjet\`);
        return true;
      } catch (error: any) {
        console.error('Mailjet Error:', error);
        return false;
      }
    };
