// let careerConnect = {
//   name: "CareerConnect",
//   url: "https://careerconnect.com/",
//   icon: "fa-globe",
// };
// console.log(careerConnect);

// greet = (d) => {
//   console.log("Hello, " + d);
// };
// greet("Alic");

// const firstName = 'John';
// console.log(`Hello, ${firstName}!`);

const nodeMailer = require("nodemailer");
let transporter = nodeMailer.createTransport({
  host: "smtp.zoho.com",
  secure: true,
  port: 465,
  auth: {
    user: "hello@grazacacademy.com",
    pass: "GRAZACACADEMY",
  },
});

const mailOptions = {
  from: "hello@grazacacademy.com", // sender address
  to: "fredrickbolutife@gmail.com", //
  subject: "Some subject", // Subject line
  html: '<p>test</p>', // HTML content wrapped in quotes
};

transporter.sendMail(mailOptions, function(err, info) {
  if (err) {
    // handle error
    console.error(err);
  } else {
    // email sent successfully
    console.log("Email sent: " + info.response);
  }
});


// const nodeMailer = require("nodemailer");

// let transporter = nodeMailer.createTransport({
//   host: "smtp.zoho.com",
//   port: 587, // You may also try 587
//   secure: true, // true for 465, false for other ports
//   auth: {
//     user: "hello@grazacacademy.com",
//     pass: "GRAZACACADEMY",
//   },
// });

// const mailOptions = {
//   from: "hello@grazacacademy.com", // sender address
//   to: "fredrickbolutife@gmail.com", // receiver address
//   subject: "Some subject", // Subject line
//   html: '<p>test</p>', // HTML content wrapped in quotes
// };

// transporter.sendMail(mailOptions, function (err, info) {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log("Email sent: " + info.response);
//   }
// });
