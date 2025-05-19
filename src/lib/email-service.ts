
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
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'; // Fallback for local dev

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
  });

  const adminPanelUrl = `${appBaseUrl}/admin`;

  const mailOptions: MailOptions = {
    from: `"Masal Dünyası Bildirimleri" <${mailUser}>`, // Sender address
    to: mailTo, // List of receivers
    subject: `Yeni Masal Onay Bekliyor: ${storyTitle}`, // Subject line
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #4A5568;">Yeni Bir Masal Onayınızı Bekliyor!</h1>
        <p>Merhaba,</p>
        <p>"Masal Dünyası" için yeni bir hikaye üretildi ve onayınızı bekliyor:</p>
        <br>
        <p><strong>Başlık:</strong> ${storyTitle}</p>
        <p><strong>İçerik (Önizleme):</strong></p>
        <div style="padding: 15px; border: 1px solid #e2e8f0; background-color: #f7fafc; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0;">${storyContentSnippet.substring(0, 800)}${storyContentSnippet.length > 800 ? '...' : ''}</p>
        </div>
        
        <p>Bu masalı yönetmek için lütfen Masal Dünyası yönetici panelini ziyaret edin. Aşağıdaki butonları kullanarak panele hızlıca erişebilirsiniz:</p>
        
        <table width="100%" cellspacing="0" cellpadding="0" style="margin-top: 25px; margin-bottom: 25px;">
          <tr>
            <td>
              <table cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td align="center" width="200" height="40" bgcolor="#4CAF50" style="border-radius: 5px; color: #ffffff; display: block;">
                    <a href="${adminPanelUrl}" target="_blank" style="font-size: 16px; font-weight: bold; font-family: sans-serif; text-decoration: none; line-height:40px; width:100%; display:inline-block; color: #ffffff;">
                      Panelde Onayla
                    </a>
                  </td>
                  <td width="20"></td> {/* Spacer */}
                  <td align="center" width="200" height="40" bgcolor="#f44336" style="border-radius: 5px; color: #ffffff; display: block;">
                    <a href="${adminPanelUrl}" target="_blank" style="font-size: 16px; font-weight: bold; font-family: sans-serif; text-decoration: none; line-height:40px; width:100%; display:inline-block; color: #ffffff;">
                      Panelde Reddet/Düzenle
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <p style="font-size: 0.9em; color: #718096;"><em>(Not: Onaylama, reddetme ve düzenleme işlemleri şu anda sadece yönetici panelinden yapılmaktadır.)</em></p>
        <br>
        <p>Teşekkürler,</p>
        <p>Masal Dünyası Ekibi</p>
        <br>
        <p style="font-size: 0.8em; color: #a0aec0;"><em>(Bu e-posta otomatik olarak gönderilmiştir. Lütfen bu adrese yanıt vermeyiniz.)</em></p>
      </div>
    `, // html body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${mailTo} for story "${storyTitle}". Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Error sending approval email for story "${storyTitle}":`, error);
    if (error instanceof Error && 'responseCode' in error) {
        // @ts-ignore
        console.error('Nodemailer response code:', error.responseCode);
        // @ts-ignore
        console.error('Nodemailer response:', error.response);
    }
    return false;
  }
}
