
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
  const mailTo = process.env.EMAIL_TO;
  const mailUser = process.env.EMAIL_USER;
  const mailPass = process.env.EMAIL_APP_PASSWORD;
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'; // Fallback for local dev

  if (!mailTo || !mailUser || !mailPass) {
    console.error('Email credentials (EMAIL_USER, EMAIL_APP_PASSWORD) or recipient (EMAIL_TO) not found in .env file. Skipping email.');
    return false;
  }

  console.log(`Attempting to send email from ${mailUser} to ${mailTo} for story ID: ${storyId}`);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mailUser,
      pass: mailPass, // Use the App Password here
    },
  });

  const approvalUrl = `${appBaseUrl}/admin/email-action?storyId=${storyId}&task=approve`;
  const rejectionUrl = `${appBaseUrl}/admin/email-action?storyId=${storyId}&task=reject`;
  const adminPanelUrl = `${appBaseUrl}/admin`;

  const mailOptions: MailOptions = {
    from: `"DüşBox Bildirimleri" <${mailUser}>`, // Sender address
    to: mailTo, // List of receivers
    subject: `Yeni Masal Onay Bekliyor: ${storyTitle}`, // Subject line
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <h1 style="color: #4A5568; text-align: center;">Yeni Bir Masal Onayınızı Bekliyor!</h1>
        <p>Merhaba,</p>
        <p>"DüşBox" için yeni bir hikaye üretildi ve onayınızı bekliyor:</p>
        <br>
        <p><strong>Başlık:</strong> ${storyTitle}</p>
        <p><strong>İçerik (Önizleme):</strong></p>
        <div style="padding: 15px; border: 1px solid #e2e8f0; background-color: #f7fafc; border-radius: 8px; margin-bottom: 20px; max-height: 200px; overflow-y: auto;">
          <p style="margin: 0;">${storyContentSnippet.substring(0, 800)}${storyContentSnippet.length > 800 ? '...' : ''}</p>
        </div>
        
        <p>Bu masalı e-posta üzerinden hızlıca yönetebilir veya detaylı inceleme için yönetici panelini ziyaret edebilirsiniz:</p>
        
        <table width="100%" cellspacing="0" cellpadding="0" style="margin-top: 25px; margin-bottom: 25px;">
          <tr>
            <td align="center">
              <a href="${approvalUrl}" target="_blank" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-size: 16px; font-weight: bold; margin: 5px;">
                E-postadan Onayla
              </a>
              <a href="${rejectionUrl}" target="_blank" style="background-color: #f44336; color: white; padding: 12px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-size: 16px; font-weight: bold; margin: 5px;">
                E-postadan Reddet
              </a>
            </td>
          </tr>
           <tr>
            <td align="center" style="padding-top: 15px;">
              <a href="${adminPanelUrl}" target="_blank" style="background-color: #007bff; color: white; padding: 12px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-size: 16px; font-weight: bold; margin: 5px;">
                Yönetici Paneline Git
              </a>
            </td>
          </tr>
        </table>

        <p style="font-size: 0.9em; color: #718096; text-align: center;"><em>(E-postadan yapılan onay/reddetme işlemleri doğrudan uygulanır. Detaylı düzenleme için lütfen yönetici panelini kullanın.)</em></p>
        <br>
        <p>Teşekkürler,</p>
        <p>DüşBox Ekibi</p>
        <br>
        <p style="font-size: 0.8em; color: #a0aec0; text-align: center;"><em>(Bu e-posta otomatik olarak gönderilmiştir. Lütfen bu adrese yanıt vermeyiniz.)</em></p>
      </div>
    `, // html body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${mailTo} for story ID ${storyId}, title "${storyTitle}". Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Error sending approval email for story ID ${storyId}, title "${storyTitle}":`, error);
    if (error instanceof Error && 'responseCode' in error) {
        // @ts-ignore
        console.error('Nodemailer response code:', error.responseCode);
        // @ts-ignore
        console.error('Nodemailer response:', error.response);
    }
    return false;
  }
}
