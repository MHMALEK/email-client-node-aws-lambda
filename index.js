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

  let _body = JSON.parse(event.body);

  let body_txt = "<h2>Contact Form Details</h2>";
  for (var key in _body) {
    var res = key.replace("_", " ");
    body_txt +=
      "<p><strong>" + titleCase(res) + " : </strong>" + _body[key] + "</p>";
  }

  let mailOptions = {
    from: process.env.SMTP_USERNAME,
    to: process.env.EMAIL_RECIPIENT,
    subject: "New contact form submission",
    html: body_txt,
  };

  transporter.sendMail(mailOptions, done(null, _body));
};

// convert the key as the label
function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // return the joined string
  return splitStr.join(" ");
}
