import { Publisher } from "./../../common/events/base-publisher";
import {Subjects} from "./../../common/events/subjects";
import { TicketUpdatedEvent } from "./../../common/events/ticket-updated-event";

export class TicketUpdatedPublisher extends Publisher <TicketUpdatedEvent>{
  subject:Subjects.TicketUpdated = Subjects.TicketUpdated ;
}