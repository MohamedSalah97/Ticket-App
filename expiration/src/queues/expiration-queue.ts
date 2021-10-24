import Queue  from "bull";
import {ExpirationCompletePublisher} from '../events/publishers/expiration-complete-publisher';
import {natsWrapper} from '../nats-wrapper';

// an interface to describe the data which will stick to the job
interface payload {
  orderId: string
}

const expirationQueue = new Queue<payload> ('order:expiration',{
  redis:{
    host: process.env.REDIS_HOST
  }
});

expirationQueue.process(async (job) =>{
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId
  })
});

export{expirationQueue};