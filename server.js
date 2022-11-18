import { WebSocketServer } from 'ws';
import { v4 as uuid } from 'uuid';

const wss = new WebSocketServer({ port: 8000 });
const clients = {}; // хранилище клиентов
const messagesStore = []; // хранилище сообщений

wss.on('connection', (ws) => {
  const id = uuid();
  clients[id] = ws;

  console.log(`New client ${id}`);
  ws.send(JSON.stringify(messagesStore)); // <-- Здесь мы отдаем пользователю все сообщения, которые были раньше

  ws.on('message', (rawMessage) => {
    const { text, name } = JSON.parse(rawMessage);

    messagesStore.push({
      id: uuid(),
      name,
      text
    });

    for(const id in clients) {
      clients[id].send(JSON.stringify([{ name, text }]))
    }
  });
  
  ws.on('close', () => {
    delete clients[id];
    console.log(`Client is closed ${id}`);
  })
});