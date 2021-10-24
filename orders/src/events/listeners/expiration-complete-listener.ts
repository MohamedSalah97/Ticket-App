import { Message } from "node-nats-streaming";
import { Listener } from "../../common/events/base-listener";
import { ExpirationCompleteEvent } from "../../common/events/expiration-complete-event";
import { Subjects } from "../../common/events/subjects";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderStatus } from "../../common/events/types/order-status";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
  subject:Subjects.ExpirationCompelet = Subjects.ExpirationCompelet ;
  queueGroupName = queueGroupName ;

  async onMessage(data:ExpirationCompleteEvent['data'], msg:Message){
    const order = await Order.findById(data.orderId).populate('ticket');

    if(!order){
      throw new Error('order not found');
    }
    if(order.status === OrderStatus.Copmlete){
      return msg.ack() ;
    }

    order.set({
      status: OrderStatus.Cancelled
    });

    await order.save();

    // we added the await to make sure that the event is published before acking the message
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket:{
        id: order.ticket.id
      }
    });

    msg.ack();
  }
}