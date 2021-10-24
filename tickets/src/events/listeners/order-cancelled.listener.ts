import { Message } from "node-nats-streaming";
import { Listner } from "../../common/events/base-listener";
import { OrderCancelledEvent } from "../../common/events/order-cancelled-event";
import { Subjects } from "../../common/events/subjects";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updating-publisher";

export class OrderCancelledListener extends Listner<OrderCancelledEvent>{
  subject:Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName ;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message){
    // find the ticket that the order is reservied
    const ticket = await Ticket.findById(data.ticket.id);
   //if no ticket , throw an error
   if (!ticket){
     throw new Error('Ticket is not found')
   }
   // return the orderId property to undefined
    ticket.set({orderId: undefined})
   // save the ticket
   await ticket.save()

   //publish an event to tell the order that there is a change in ticket and version nunmber is increased
   //so the two tickets collections will be in sync
   await new TicketUpdatedPublisher(this.client).publish({
     id: ticket.id,
     title: ticket.title,
     price: ticket.price,
     userId: ticket.userId,
     version: ticket.version,
     orderId: ticket.orderId
   })

   // ack the message
   msg.ack();
  }
}