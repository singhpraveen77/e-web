import nodemailer from 'nodemailer';

const sendEmail = async (Option) => {

    console.log(
        'SMTP host, port, service, mail:',
        process.env.SMPT_HOST,
        process.env.SMPT_PORT,
        process.env.SMPT_SERVICE,
        process.env.SMPT_MAIL
    );

    const transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: Number(process.env.SMPT_PORT),
        service: process.env.SMPT_SERVICE,   // 'gmail'
        secure: false,                      // Gmail uses TLS on port 587
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASS
        },
        tls: {
            rejectUnauthorized: false        // avoid handshake issues
        }
    });

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: Option.email,
        subject: Option.subject,
        text: Option.message
    };

    // verify connection first (debug)
    await transporter.verify().catch(err => {
        console.log("VERIFY ERROR:", err);
        throw err;
    })

    // send email
    await transporter.sendMail(mailOptions);
}

export { sendEmail };
