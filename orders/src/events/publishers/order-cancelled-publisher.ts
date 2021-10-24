import { Publisher } from "../../common/events/base-publisher";
import { OrderCancelledEvent } from "../../common/events/order-cancelled-event";
import { Subjects } from "../../common/events/subjects";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled ;
}