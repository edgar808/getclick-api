import { Get, JsonController } from 'routing-controllers';

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
