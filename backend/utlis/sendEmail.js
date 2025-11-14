import nodemailer from 'nodemailer';

const sendEmail = async (Option) => {

    console.log(
        'SMTP host, port, service, mail:',
        process.env.SMPT_HOST,
        process.env.SMPT_PORT,
        process.env.SMPT_SERVICE,
        process.env.SMPT_MAIL
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

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: Option.email,
        subject: Option.subject,
        text: Option.message,
        html: Option.html
    };

    // verify connection first (debug)
    if (process.env.NODE_ENV !== 'production') {
        await transporter.verify().catch(err => {
            console.log("VERIFY ERROR:", err);
            throw err;
        })
    }

    // send email
    await transporter.sendMail(mailOptions);
}

export { sendEmail };
