import io from 'socket.io-client';

const host = process.env.NEXT_PUBLIC_CONF_ENDPOINT || 'http://localhost:4001';

// const sockets = io('http://localhost:3001', { autoConnect: true, forceNew: true });
const sockets = io(host);
export default sockets;
