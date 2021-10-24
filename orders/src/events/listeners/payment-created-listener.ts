import { Subjects } from "../../common/events/subjects";
import { Listener } from "../../common/events/base-listener";
import { PaymentCreatedEvent } from "../../common/events/payment-created-event";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderStatus } from "../../common/events/types/order-status";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
  subject:Subjects.PaymentCreated = Subjects.PaymentCreated ;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'],msg: Message){
    const order = await Order.findById(data.orderId);

    if(!order){
      throw new Error('Cannot find an order');
    }

    order.set({
      status: OrderStatus.Copmlete 
    });

    await order.save();

    msg.ack();
  }
}