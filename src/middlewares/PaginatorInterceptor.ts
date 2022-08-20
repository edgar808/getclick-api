import { Interceptor, InterceptorInterface, Action } from 'routing-controllers';
import { Service } from 'typedi';
import { Environment } from '../config';

interface IPagination {
  limit?: number;
  offset?: number;
  total?: number;
}

@Service()
@Interceptor()
export class PaginatorInterceptor implements InterceptorInterface {
  sequelizeArrayDataToJSON = (data) => [...data.map((item: any) => item.toJSON())];

  intercept(action: Action, content: any) {
    const pagination: IPagination | null = {};

    if (!content) return 'OK';

    if (content.rows || Array.isArray(content)) {
      if (content.rows) {
        pagination.total = content.count;
        content.data = this.sequelizeArrayDataToJSON(content.rows);
        if (action.request.method === 'GET') {
          pagination.limit = parseInt(action.request.query.limit, 10) || Environment.Pagination.Limit;
          pagination.offset = parseInt(action.request.query.offset, 10) || Environment.Pagination.Offset;
        } else {
          pagination.limit = parseInt(action.request.body.limit, 10) || Environment.Pagination.Limit;
          pagination.offset = parseInt(action.request.body.offset, 10) || Environment.Pagination.Offset;
        }
        return {
          data: content.data,
          pagination,
        };
      }
      return this.sequelizeArrayDataToJSON(content);
    }
    if (content.dataValues) return content.toJSON();
    return content;
  }
}

