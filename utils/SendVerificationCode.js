const nodemailer = require("nodemailer");

// createTransport is an method defined in nodemailer(object of nodemailer package) 
// it setup's connection with SMTP server of Gmail so that our web can send email
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,//
  secure: false,// use STARTTLS (upgrade connection to TLS(Transport Layer Security) after connecting to Gmail server)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports.sendVerificationCode = async (email, verificationCode) => {
  try {
    //transporter(now becomes object) sendMail is its method 
    const response = await transporter.sendMail({
      from: `"wonderlust Team" ${process.env.SMTP_USER}`,
      to: email, // list of recipients
      subject: "Verify your E-mail",
      text: "Verify your E-mail ",
      html: verificationCode,
    });
    // console.log("email sent",response);
  } catch (err) {
    console.log(err);
  }
};
