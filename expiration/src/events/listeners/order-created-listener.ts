import { Message } from "node-nats-streaming";
import { Listner } from "../../common/events/base-listener";
import { OrderCreatedEvent } from "../../common/events/order-created-event";
import { Subjects } from "../../common/events/subjects";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listner<OrderCreatedEvent>{
  subject:Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName = queueGroupName ;

  async onMessage(data: OrderCreatedEvent['data'], msg:Message){
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime() ;

    await expirationQueue.add({
      orderId: data.id
    },{
      delay
    });

    msg.ack();
  }
}