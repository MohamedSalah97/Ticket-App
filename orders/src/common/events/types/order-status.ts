// to strict the types of status that order can have

export enum OrderStatus {
  Created = 'created' ,
  Cancelled = 'cancelled',
  AwaitingPayment = 'awaiting:payment',
  Copmlete = 'compelete'
}