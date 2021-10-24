import { Subjects } from "./subjects";

export interface ExpirationCompleteEvent {
  subject: Subjects.ExpirationCompelet ;
  data:{
    orderId: string ;
  }
}