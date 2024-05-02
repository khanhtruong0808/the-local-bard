"use server";

import { MailDataRequired, MailService } from "@sendgrid/mail";

import { serverEnv } from "./serverEnv";

export const sendEmail = async (
  data: MailDataRequired | MailDataRequired[],
  isMultiple?: boolean,
) => {
  const sgMail = new MailService();
  sgMail.setApiKey(serverEnv.SENDGRID_API_KEY);

  await sgMail.send(data, isMultiple);
  return null;
};
