import { MessageDocument } from './../../schema/message.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from 'schema/message.schema';
import { FAQs } from 'utils/faq';

@Injectable()
export class ChatService {
    constructor(@InjectModel(Message.name) private msgModel:Model<MessageDocument>){}



    async saveMessage(sessionId: string, sender: 'user' | 'bot' | 'agent', message: string){
        const msg = new this.msgModel({sessionId, sender, message});
        await msg.save();
    }


    getBotReply(messgae:string):string{
        const availableQuestions = Object.keys(FAQs).map((q) => `- ${q}`).join('\n');
        return FAQs[messgae] || `there is no answer...you can ask me about...... 
        ${availableQuestions} `;
    }

    async getMessages(sessionId: string){
        return this.msgModel.find({ sessionId }).sort({ createdAt: 1 });
    }
}
