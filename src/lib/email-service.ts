
'use server';

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Ensure environment variables are loaded. 
// Next.js typically handles .env for server components/actions, 
// but explicit dotenv.config() can be a safeguard, especially if this module is used elsewhere.
dotenv.config();

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export async function sendApprovalEmail(storyTitle: string, storyContentSnippet: string): Promise<boolean> {
  const mailTo = process.env.EMAIL_TO;
  const mailUser = process.env.EMAIL_USER;
  const mailPass = process.env.EMAIL_APP_PASSWORD;

  if (!mailTo || !mailUser || !mailPass) {
    console.error('Email credentials (EMAIL_USER, EMAIL_APP_PASSWORD) or recipient (EMAIL_TO) not found in .env file. Skipping email.');
    return false;
  }

  console.log(`Attempting to send email from ${mailUser} to ${mailTo}`);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mailUser,
      pass: mailPass, // Use the App Password here
    },
    // Optional: Add secure: false and tls: { rejectUnauthorized: false } for some local environments,
    // but this is less secure and generally not needed for Gmail with App Passwords.
    // tls: {
    //   rejectUnauthorized: false 
    // }
  });

  const mailOptions: MailOptions = {
    from: `"Masal Dünyası Bildirimleri" <${mailUser}>`, // Sender address
    to: mailTo, // List of receivers
    subject: `Yeni Masal Onay Bekliyor: ${storyTitle}`, // Subject line
    html: `
      <h1>Yeni Bir Masal Onayınızı Bekliyor!</h1>
      <p>Merhaba,</p>
      <p>"Masal Dünyası" için yeni bir hikaye üretildi ve onayınızı bekliyor:</p>
      <br>
      <p><strong>Başlık:</strong> ${storyTitle}</p>
      <p><strong>İçerik (Önizleme):</strong></p>
      <div style="padding: 10px; border: 1px solid #eee; background-color: #f9f9f9; border-radius: 5px;">
        <p>${storyContentSnippet.substring(0, 800)}${storyContentSnippet.length > 800 ? '...' : ''}</p>
      </div>
      <br>
      <p>Bu masalı onaylamak veya düzenlemek için lütfen Masal Dünyası yönetici panelini ziyaret edin.</p>
      <br>
      <p>Teşekkürler,</p>
      <p>Masal Dünyası Ekibi</p>
      <br>
      <p><em>(Bu e-posta otomatik olarak gönderilmiştir. Lütfen bu adrese yanıt vermeyiniz.)</em></p>
    `, // html body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${mailTo} for story "${storyTitle}". Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Error sending approval email for story "${storyTitle}":`, error);
    // Log more details from the error object if available
    if (error instanceof Error && 'responseCode' in error) {
        // @ts-ignore
        console.error('Nodemailer response code:', error.responseCode);
        // @ts-ignore
        console.error('Nodemailer response:', error.response);
    }
    return false;
  }
}
