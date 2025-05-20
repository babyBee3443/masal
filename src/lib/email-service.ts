
'use server';

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Ensure environment variables are loaded.
dotenv.config();

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export async function sendApprovalEmail(storyId: string, storyTitle: string, storyContentSnippet: string): Promise<boolean> {
  const adminRecipientEmail = process.env.EMAIL_TO; // Yönetici e-posta adresi .env'den okunuyor
  const mailUser = process.env.EMAIL_USER;
  const mailPass = process.env.EMAIL_APP_PASSWORD;
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

  if (!adminRecipientEmail) {
    console.error('Admin recipient email (EMAIL_TO) not found in .env file. Skipping email.');
    return false;
  }
  if (!mailUser || !mailPass) {
    console.error('Email credentials (EMAIL_USER, EMAIL_APP_PASSWORD) not found in .env file. Skipping email.');
    return false;
  }

  console.log(`Attempting to send approval email from ${mailUser} to ${adminRecipientEmail} for story ID: ${storyId}`);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mailUser,
      pass: mailPass,
    },
  });

  const approvalUrl = `${appBaseUrl}/admin/email-action?storyId=${storyId}&task=approve`;
  const rejectionUrl = `${appBaseUrl}/admin/email-action?storyId=${storyId}&task=reject`;
  const adminPanelUrl = `${appBaseUrl}/admin`;

  const mailOptions: MailOptions = {
    from: `"DüşBox Bildirimleri" <${mailUser}>`,
    to: adminRecipientEmail, // Alıcı olarak .env'den okunan adres kullanılıyor
    subject: `Yeni Masal Onay Bekliyor: ${storyTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #8A2BE2; font-size: 24px;">Yeni Bir Düş Onayınızı Bekliyor!</h1>
        </div>
        <p>Merhaba,</p>
        <p>"DüşBox" platformunda yeni bir masal üretildi ve sizin onayınızı bekliyor:</p>
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-top: 15px; margin-bottom: 20px; border: 1px solid #eee;">
          <h3 style="color: #4A4A4A; margin-top: 0;">${storyTitle}</h3>
          <p style="font-size: 0.9em; color: #555; max-height: 150px; overflow-y: auto; border-left: 3px solid #8A2BE2; padding-left: 10px;">
            ${storyContentSnippet.substring(0, 500)}${storyContentSnippet.length > 500 ? '...' : ''}
          </p>
        </div>
        
        <p>Aşağıdaki butonları kullanarak bu masalı yönetebilir veya detaylı inceleme için yönetici panelini ziyaret edebilirsiniz:</p>
        
        <table width="100%" cellspacing="0" cellpadding="0" style="margin-top: 25px; margin-bottom: 25px;">
          <tr>
            <td align="center" style="padding: 5px;">
              <a href="${approvalUrl}" target="_blank" style="background-color: #5cb85c; color: white; padding: 12px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-size: 15px; font-weight: bold; min-width: 120px;">
                Onayla
              </a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 5px;">
              <a href="${rejectionUrl}" target="_blank" style="background-color: #d9534f; color: white; padding: 12px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-size: 15px; font-weight: bold; min-width: 120px;">
                Reddet
              </a>
            </td>
          </tr>
           <tr>
            <td align="center" style="padding: 15px 5px 5px 5px;">
              <a href="${adminPanelUrl}" target="_blank" style="background-color: #007bff; color: white; padding: 12px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-size: 15px; font-weight: bold; min-width: 120px;">
                Yönetici Paneli
              </a>
            </td>
          </tr>
        </table>

        <p style="font-size: 0.9em; color: #718096; text-align: center;"><em>(E-postadan yapılan onay/reddetme işlemleri doğrudan uygulanır. Detaylı düzenleme için lütfen yönetici panelini kullanın.)</em></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 0.8em; color: #a0aec0; text-align: center;">DüşBox Ekibi<br><em>Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.</em></p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${adminRecipientEmail} for story ID ${storyId}, title "${storyTitle}". Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Error sending approval email for story ID ${storyId}, title "${storyTitle}" to ${adminRecipientEmail}:`, error);
    if (error instanceof Error && 'responseCode' in error) {
        // @ts-ignore
        console.error('Nodemailer response code:', error.responseCode);
        // @ts-ignore
        console.error('Nodemailer response:', error.response);
    }
    return false;
  }
}
