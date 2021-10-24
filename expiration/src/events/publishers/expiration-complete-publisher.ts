import { Subjects } from "../../common/events/subjects";
import { Publisher } from "../../common/events/base-publisher";
import { ExpirationCompleteEvent } from "../../common/events/expiration-complete-event";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
  subject:Subjects.ExpirationCompelet = Subjects.ExpirationCompelet ;
}