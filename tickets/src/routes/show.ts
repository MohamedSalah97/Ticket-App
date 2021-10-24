import express,{Request,Response} from 'express';
import { Ticket } from '../models/tickets';
import { NotFoundError } from './../common/errors/not-found-error';

const router = express.Router();

router.get('/api/tickets/:id', async (req:Request, res:Response)=>{
  const {id} = req.params ;

  const foundTicket = await Ticket.findById(id);

  if(!foundTicket){
    throw new NotFoundError();
  }

  res.status(200).send(foundTicket);
})

export {router as showTicketRouter};