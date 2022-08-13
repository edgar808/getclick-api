import * as ejs from 'ejs';
import * as sendGrid from '@sendgrid/mail';
import * as path from 'path';
import { mailerConfig } from '../../config';

sendGrid.setApiKey(mailerConfig.SENDGRID_API_KEY);

class Mailer {
  static async sendEmail({
    from = mailerConfig.SENDER,
    to,
    subject,
    template,
    params,
  }: any) {
    const dirname = path.resolve();

    const options = {
      from,
      to,
      subject,
      html: await ejs.renderFile(`${dirname}/templates/${template}.ejs`, { params }),
    };

    return sendGrid.send(options, false);
  }
}

export default Mailer;
