import { createTransport } from "nodemailer";

export const sendMeil = async (
  reciverMeil: string,
  context: string,
  token: string
) => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: process.env.MAIL, // sender address
    to: reciverMeil, // list of receivers
    subject: "verife email", // Subject line
    text: "email verifer", // plain text body
    html: `<a href='http://localhost:4500/auth/verife-email/${token}'> verife </a>`,
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error: Error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
