import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type MessageDocument = Message & Document;
@Schema({timestamps:true})
export class Message {
@Prop({required:true})
sessionId:string;

@Prop({required:true})
message: string;


@Prop({ required: true, enum: ['user', 'bot', 'agent'] })
sender: 'user' | 'bot' | 'agent';
}

export const MessageSchema = SchemaFactory.createForClass(Message);