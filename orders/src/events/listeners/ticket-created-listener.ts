import {Message} from 'node-nats-streaming';
import { Subjects } from '../../common/events/subjects';
import { Listener } from '../../common/events/base-listener';
import { TicketCreatedEvent } from '../../common/events/ticket-created-event';
import { Ticket } from '../../models/ticket';
import {queueGroupName} from './queue-group-name' ;

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName ;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message){
    const {id ,title, price} = data ;
    const ticket = Ticket.build({
      id,
      title,
      price
    });
    await ticket.save();

    msg.ack();  
  }
}