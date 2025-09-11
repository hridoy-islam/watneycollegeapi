import nodemailer from "nodemailer";
import ejs from "ejs";
import config from "../config";
require("dotenv").config();
const { google } = require("googleapis");

export const sendEmailAdminCourse = async (
 to: string,
  template: string,
  subject: string,
  name: string,
  email?: string,
  courseName?: string,
  termName?: string,
  previousCourseName?:string

) => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const accessToken = await oAuth2Client.getAccessToken();

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
      accessToken: accessToken?.token || "",
    },
  });

  try {
    const html = await ejs.renderFile(
      __dirname + "/../static/email_template/" + template + ".ejs",
      {
       name: name,
        email,
        courseName,
        termName,
        previousCourseName
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
