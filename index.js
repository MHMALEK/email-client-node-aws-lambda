var nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: process.env.SMTP_PORT,
  secure: false,
  debug: true,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

exports.handler = (event, context, callback) => {
  const done = (err, res) =>
    callback(null, {
      statusCode: err ? "400" : "200",
      body: err ? err.message : JSON.stringify(res),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
    });

  let mailOptions = {
    from: process.env.SMTP_USERNAME,
    to: process.env.EMAIL_RECIPIENT,
    subject: "New contact form submission",
    html: `<h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${event.name}</p>
        <p><strong>Email:</strong> ${event.email}</p>
        <p><strong>Message:</strong><br>${event.message}</p>`,
  };

  transporter.sendMail(mailOptions, done(null, _body));
};
