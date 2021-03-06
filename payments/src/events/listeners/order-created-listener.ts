import { Message } from "node-nats-streaming";
import { Listener } from "../../common/events/base-listener";
import { OrderCreatedEvent } from "../../common/events/order-created-event";
import { Subjects } from "../../common/events/subjects";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
  subject:Subjects.OrderCreated = Subjects.OrderCreated ;
  queueGroupName = queueGroupName;

  async onMessage(data:OrderCreatedEvent['data'] , msg:Message){
    const order =  Order.build({
      id: data.id,
      userId: data.userId,
      status: data.status,
      price: data.ticket.price,
      version: data.version
    });

    await order.save();

    msg.ack();
  }
}