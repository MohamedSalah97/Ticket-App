import { Publisher } from "./../../common/events/base-publisher";
import {Subjects} from "./../../common/events/subjects";
import { TicketCreatedEvent } from "./../../common/events/ticket-created-event";

export class TicketCreatedPublisher extends Publisher <TicketCreatedEvent>{
  subject:Subjects.TicketCreated = Subjects.TicketCreated ;

  
}