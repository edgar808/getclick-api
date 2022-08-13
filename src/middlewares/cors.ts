import { MethodNotAllowedError } from 'routing-controllers';
import { CORS_LIST } from '../config';

export const verify = (origin, callback) => {
  if (process.env.NODE_ENV !== 'production') {
    return callback(null, origin || '*');
  }
  const list = CORS_LIST ? CORS_LIST.split(',') : [];
  if (list.length === 0) {
    return callback(new MethodNotAllowedError('CORS'), null);
  }
  return callback(null, list);
};
