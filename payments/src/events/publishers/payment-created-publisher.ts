import { Publisher } from "../../common/events/base-publisher";
import { Subjects } from "../../common/events/subjects";
import { PaymentCreatedEvent } from "../../common/events/payment-created-event";

export class PaymentCreatedPublisher extends Publisher <PaymentCreatedEvent>{
  subject:Subjects.PaymentCreated = Subjects.PaymentCreated ;
}