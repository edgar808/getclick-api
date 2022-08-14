import * as ejs from 'ejs';
import * as sendGrid from '@sendgrid/mail';
import * as path from 'path';
import { Environment } from '../../config';

class Mailer {
  client;

  constructor() {
    this.client = sendGrid;
    this.client.setApiKey(Environment.MailerConfig.SENDGRID_API_KEY);
  }

  /**
   * @param email
   * @param subject
   * @param template
   * @param params
   */
  async sendEmail({
    email, subject, template, params,
  }) {
    const dirname = path.resolve();
    const options = {
      from: Environment.MailerConfig.SENDER,
      to: email,
      subject,
      html: await ejs.renderFile(`${dirname}/templates/${template}.ejs`, { params }),
    };

    this.client.send(options, false).then(() => {
      console.log(`SEND ${subject}`);
    }).catch((e) => {
      console.log(e?.response?.body, 'SEND_GRID ERROR');
    });
  }

  async sendMultiple({
    to, subject, template, params,
  }) {
    const dirname = path.resolve();

    const options = {
      from: Environment.MailerConfig.SENDER,
      to,
      subject,
      html: await ejs.renderFile(`${dirname}/templates/${template}.ejs`, { params }),
    };

    sendGrid.sendMultiple(options).then(() => {
      console.log(`SEND ${subject}`);
    }).catch((e) => {
      console.log(e?.response?.body, 'SEND_GRID ERROR');
    });
  }

  async sendPersonalize({
    personalizations, subject, template, params,
  }) {
    const dirname = path.resolve();

    const options = {
      personalizations,
      from: Environment.MailerConfig.SENDER,
      subject,
      html: await ejs.renderFile(`${dirname}/templates/${template}.ejs`, { params }),
    };

    sendGrid.sendMultiple(options).then(() => {
      console.log(`SEND ${subject}`);
    }).catch((e) => {
      console.log(e?.response?.body, 'SEND_GRID ERROR');
    });
  }

  /**
   * @param userId
   * @param email
   * @param token
   */
  async emailVerification(userId: string, email: string, token: string) {
    await this.sendEmail({
      email,
      subject: Environment.EmailSubjects.EMAIL_VERIFICATION,
      template: 'email-verification',
      params: {
        url: Environment.FrontBaseUrl,
        data: {
          link:
          // eslint-disable-next-line max-len
                        `${Environment.FrontBaseUrl}${Environment.FrontResetPasswordUrl}?token=${token}&userId=${userId}`,
        },
      },
    });
  }

  /**
     * @param userId
     * @param email
     * @param token
     */
  async inviteVerification(userId: string, email: string, token: string) {
    await this.sendEmail({
      email,
      subject: Environment.EmailSubjects.INVITE,
      template: 'invite-verification',
      params: {
        url: Environment.FrontBaseUrl,
        data: {
          link:
          // eslint-disable-next-line max-len
                        `${Environment.FrontBaseUrl}${Environment.FrontResetPasswordUrl}?token=${token}&userId=${userId}`,
        },
      },
    });
  }

  /**
   * @param email
   */
  async afterSignup(email: string) {
    await this.sendEmail({
      email,
      subject: Environment.EmailSubjects.AFTER_SIGNUP,
      template: 'after-signup',
      params: { url: Environment.FrontBaseUrl },
    });
  }

  /**
   * @param email
   * @param token
   */
  async forgotPassword(email: string, token: string) {
    await this.sendEmail({
      email,
      subject: Environment.EmailSubjects.RESET_PASSWORD,
      template: 'forgot-password',
      params: {
        url: Environment.FrontBaseUrl,
        data: {
          link: `${Environment.FrontBaseUrl}${Environment.FrontResetPasswordUrl}?token=${token}`,
        },
      },
    });
  }
}

export default new Mailer();
