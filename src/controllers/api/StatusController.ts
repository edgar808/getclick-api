import { Get, JsonController } from 'routing-controllers';
import { Service } from 'typedi';

@Service()
@JsonController('/status')
export default class StatusController {
  @Get('/')
  async get() {
    return {
      status: 'OK',
      message: 'Welcome to the API',
    };
  }
}
