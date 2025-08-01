import nodemailer from "nodemailer";
import ejs from "ejs";
import config from "../config";
require("dotenv").config();
const { google } = require("googleapis");

export const sendEmail = async (
  to: string,
  template: string,
  subject: string,
  name: string,
  otp?: string,
  title?: string,
  email?: string,
  term?: string,
  studentType?: string,
  phone?: string,
  countryOfResidence?: string,
  dob?: string,
  availableFromDate?: string

) => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const transporter = nodemailer.createTransport({
    // host: "smtp.ionos.co.uk",
    // port: 587,
    // secure: false,
    service: "Gmail",
    auth: {
      type: "OAuth2",
      user: process.env.SENDER_EMAIL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken: process.env.GOOGLE_ACCESS_TOKEN,
    },
  });

  try {
    const html = await ejs.renderFile(
      __dirname + "/../static/email_template/" + template + ".ejs",
      {
        otp: otp,
        name: name,
        title: title,
        email: email,
        term: term,
        studentType: studentType,
        phone: phone,
        countryOfResidence: countryOfResidence,
        dob: dob,
        availableFromDate: availableFromDate,
      },
      {
        async: true,
      }
    );
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to,
      subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
