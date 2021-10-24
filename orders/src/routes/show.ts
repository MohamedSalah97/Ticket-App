import express,{Request,Response} from 'express';
import { Order } from '../models/order';
import { requireAuth } from './../common/middlewares/require-auth';
import { NotFoundError } from './../common/errors/not-found-error';
import { NotAuthorizedError } from './../common/errors/not-authorized-error';



const router = express.Router();

router.get('/api/orders/:orderId', requireAuth,async (req:Request ,res:Response) =>{

  const {orderId} = req.params ;

  const order = await Order.findById(orderId).populate('ticket');

  if(!order){
    throw new NotFoundError()
  };

  if(order.userId !== req.currentUser!.id){
    throw new NotAuthorizedError();
  };

  res.status(200).send(order);
});

export {router as showOrderRouter}