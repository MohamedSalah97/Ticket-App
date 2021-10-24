import { Publisher } from "../../common/events/base-publisher";
import { OrderCreatedEvent } from "../../common/events/order-created-event";
import { Subjects } from "../../common/events/subjects";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated ;
}