// brevo.service.js
import 'dotenv/config';

import Brevo from '@getbrevo/brevo';
export const sendMail = async (to, subject, html) => {
  try {
    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const sendEmail = new Brevo.SendSmtpEmail();
    sendEmail.sender = { email: process.env.BREVO_SENDER_EMAIL };
    sendEmail.to = [{ email: to }];
    sendEmail.subject = subject;
    sendEmail.htmlContent = html;

    const result = await apiInstance.sendTransacEmail(sendEmail);
    return result;
  } catch (err) {
    console.error("Email error:", err);
    throw err;
  }
};

