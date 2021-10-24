import express,{Request,Response} from 'express';
import { Ticket } from '../models/tickets';
import { requireAuth } from './../common/middlewares/require-auth';
import {body} from 'express-validator';
import { validateRequest } from './../common/middlewares/validate-request';
import { NotAuthorizedError } from './../common/errors/not-authorized-error';
import { NotFoundError } from './../common/errors/not-found-error';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updating-publisher';
import { natsWrapper } from '../nats-wrapper';
import { BadRequestError } from '../common/errors/bad-request-error';

const router = express.Router();

router.put('/api/tickets/:ticketId',requireAuth, [
  body('title').not().isEmpty().withMessage("Title should be provided"),
  body('price').isFloat({ gt: 0}).withMessage('Price must be greater than zero')
] ,validateRequest , async (req:Request, res:Response) =>{
  
  const {ticketId} = req.params
  const ticket = await Ticket.findById(ticketId);

  if(!ticket){
    throw new NotFoundError();
  }

  if(ticket.orderId){
    throw new BadRequestError('Cannot edit a reserved ticket');
  }

  if(ticket.userId !== req.currentUser!.id){
    throw new NotAuthorizedError();
  } 

  const {title,price} = req.body;

  ticket.set({title,price});
  await ticket.save;

  new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    version: ticket.version,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId
  })

  res.status(201).send(ticket)
});

export {router as updateTicketRouter} ;