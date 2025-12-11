const jwt = sessionStorage.getItem('token');

const webSocket = new WebSocket(`ws://localhost:8000/ws?token=${jwt}`);

export default webSocket;
