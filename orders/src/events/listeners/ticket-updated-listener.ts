import {Message} from 'node-nats-streaming';
import { Subjects } from '../../common/events/subjects';
import { Listener } from '../../common/events/base-listener';
import { TicketUpdatedEvent } from '../../common/events/ticket-updated-event';
import { Ticket } from '../../models/ticket';
import {queueGroupName} from './queue-group-name' ;

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated ;
  queueGroupName =queueGroupName ;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message){
    const ticket = await Ticket.findByEvent(data);

    if(!ticket) {
      throw new Error('ticket not found');
    }

    const {title,price} = data ;

    ticket.set({title , price});

    await ticket.save();

    msg.ack();
  }
}