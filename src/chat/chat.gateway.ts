import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  },
})export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    console.log('WebSocket Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: { sessionId: string; message: string }) {
    const { sessionId, message } = payload;

    await this.chatService.saveMessage(sessionId, 'user', message);

    if (message.includes('agent') || message.includes('representative')) {
      await this.chatService.saveMessage(sessionId, 'bot', 'You are being transferred to a service agent...');
      this.server.to(client.id).emit('agent', { message: 'Hello, customer service from link development with you.' });
      return;
    }
    
    const botReply = this.chatService.getBotReply(message);
    await this.chatService.saveMessage(sessionId, 'bot', botReply);

    this.server.to(client.id).emit('bot', { message: botReply });
  }
}
