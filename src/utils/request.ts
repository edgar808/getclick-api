export const getClientIp = ({
  request,
}) => (request.headers['x-forwarded-for'] || '').split(',').pop()
      || (request.connection && request.connection.remoteAddress)
      || request.socket.remoteAddress
      || (request.connection && request.connection.socket.remoteAddress);

