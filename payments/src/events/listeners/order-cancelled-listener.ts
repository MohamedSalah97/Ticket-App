import { Listener } from "../../common/events/base-listener";
import { Order } from "../../models/order";
import { OrderCancelledEvent } from "../../common/events/order-cancelled-event";
import { Subjects } from "../../common/events/subjects";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { OrderStatus } from "../../common/events/types/order-status";


export class OrderCnacelledListener extends Listener<OrderCancelledEvent>{
  subject:Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data:OrderCancelledEvent['data'],msg:Message){
    const order = await Order.findOne({
      id: data.id,
      version: data.version - 1 
    })

    if(!order){
      throw new Error('Can not find order');
    }

    order.set({
      status: OrderStatus.Cancelled
    });

    msg.ack();
  }
}