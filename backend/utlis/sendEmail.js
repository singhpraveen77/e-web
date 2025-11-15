import nodemailer from 'nodemailer';

const sendEmail = async (Option) => {
  console.log(
    'SMTP env:',
    process.env.SMPT_HOST,
    process.env.SMPT_PORT,
    process.env.SMPT_SERVICE,
    process.env.SMPT_MAIL ? '[set]' : '[missing]'
  );

  const port = Number(process.env.SMPT_PORT);
  const useService = !!process.env.SMPT_SERVICE;

  if (!process.env.SMPT_MAIL || !process.env.SMPT_PASS || (!useService && (!process.env.SMPT_HOST || !port))) {
    throw new Error('Email configuration is incomplete');
  }

  const baseTransportConfig = {
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASS
    },
    logger: true,         // enable nodemailer logging
    debug: true,          // show SMTP protocol traffic
    connectionTimeout: 15000,
    socketTimeout: 15000,
    greetingTimeout: 15000,
    tls: {
      // set to true only for debugging if you suspect TLS issues.
      rejectUnauthorized: false
    }
  };

  const transportConfig = useService
    ? {
        ...baseTransportConfig,
        service: process.env.SMPT_SERVICE,
        secure: port === 465
      }
    : {
        ...baseTransportConfig,
        host: process.env.SMPT_HOST,
        port,
        secure: port === 465
      };

  const transporter = nodemailer.createTransport(transportConfig);

  // run verification even in production temporarily to see exact error
  await transporter.verify().catch(err => {
    console.error("SMTP VERIFY ERROR:", err);
    throw err;
  });

  
  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: Option.email,
    subject: Option.subject,
    text: Option.message,
    html: Option.html
  };

  const info = await transporter.sendMail(mailOptions).catch(err => {
    console.error("SENDMAIL ERROR:", err);
    throw err;
  });

  console.log('Message sent:', info && info.messageId);
};

export { sendEmail };
