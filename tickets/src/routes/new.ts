import express , {Request,Response} from 'express';
import { requireAuth } from './../common/middlewares/require-auth';
import {body} from 'express-validator';
import { validateRequest } from './../common/middlewares/validate-request';
import { Ticket } from '../models/tickets';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('api/tickets',requireAuth ,[
  body('title').not().isEmpty().withMessage("Title should be provided"),
  body('price').isFloat({ gt: 0}).withMessage('Price must be greater than zero')
] , validateRequest, async (req:Request , res: Response) => {
  const {title,price} = req.body ;
  const {id} = req.currentUser!

  const ticket = Ticket.build({title ,price , userId:id});

  await ticket.save();
  new TicketCreatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    version: ticket.version,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId
  })

  res.status(201).send(ticket);
  
});

export {router as createTicketRouter} ; 