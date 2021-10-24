import mongoose from 'mongoose' ;
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';
import { Order } from './order';
import {OrderStatus} from './../common/events/types/order-status';

interface TicketAttrs {
  id: string;
  title: string ;
  price: number;  
}

export interface TicketDoc extends mongoose.Document {
  title: string ;
  price: number;
  version: number;
  isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs) : TicketDoc ;
  findByEvent(event:{id: string , version: number}): Promise<TicketDoc | null >
}

const ticketSchema = new mongoose.Schema ({
  title:{
    type: String,
    required: true
  },
  price:{
    type: Number,
    required: true,
    min: 0
  }
},{
  toJSON:{
    transform (doc , ret) {
      ret.id = ret._id;
      delete ret._id
    }
  }
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = (event:{id: string , version: number}) =>{
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1 
  });
}

ticketSchema.statics.build = (attrs:TicketAttrs) =>{
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price
  })
}

// i will look into my order collection anlook foe such ticket with the id and one of those status if i found 
// this means the ticket is reserved
ticketSchema.methods.isReserved = async function(){
  const existingOrder = await Order.findOne({
    ticket: this.id ,
    $in:[
      OrderStatus.Created,
      OrderStatus.AwaitingPayment,
      OrderStatus.Copmlete
    ]
  });

  return !!existingOrder ;
}

const Ticket = mongoose.model<TicketDoc,TicketModel>('Ticket',ticketSchema);

export {Ticket}