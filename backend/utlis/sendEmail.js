import nodemailer from 'nodemailer'

const sendEmail = async (Option)=>{

    const transpoter= nodemailer.createTransport({
        host:process.env.SMPT_HOST,
        port:process.env.SMPT_PORT,
        service:process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASS
        }
    })

    const mailOptions={
        from:process.env.SMPT_SERVICE,
        // from:process.env.SMPT.MAIL,
        to:Option.email,
        subject:Option.subject,
        text:Option.message
    }

    await transpoter.sendMail(mailOptions);

}

export default sendEmail;
