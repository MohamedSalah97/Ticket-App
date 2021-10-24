import mongoose from 'mongoose';
import express,{Request,Response} from 'express';
import { requireAuth } from './../common/middlewares/require-auth';
import { validateRequest } from '../../../common/middlewares/validate-request';
import {body} from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { NotFoundError } from './../common/errors/not-found-error';
import { OrderStatus } from './../common/events/types/order-status';
import { BadRequestError } from './../common/errors/bad-request-error';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const router = express.Router();
const EXPIRATION_WINDOW_TIME = 15 * 60 ;

router.post('/api/orders',requireAuth,[
  body('ticketId').not().isEmpty().custom((input: string) => mongoose.Types.ObjectId.isValid(input))
  .withMessage('Ticket id must be provided')
],validateRequest , async (req:Request ,res:Response) =>{
  const {ticketId} = req.body ;
  // find the ticket that user is trying to order in database
  const ticket = await Ticket.findById(ticketId);
  if(!ticket){
    throw new NotFoundError() ;
  }
  // make sure that ticket is not reserved
  const isReserved = await ticket.isReserved();

  if(isReserved){
    throw new BadRequestError('This ticket is not available now'); 
  }
  // calculate the expiration date for this order
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_TIME)

  // build the order and save it to db
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket
  });
  await order.save();

  // publish an event for the created ticket
  await new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(),
    ticket:{
      id: ticket.id,
      price: ticket.price
    }
  })

  res.status(201).send(order);
});

export {router as newOrderRouter}