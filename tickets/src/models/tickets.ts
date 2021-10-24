import mongoose from 'mongoose';
// install mongoose-update-if-current 
import {updateIfCurrentPlugin} from 'mongoose-update-if-current' ;

// interface showing the required attrs to make a model
interface TicketAttrs {
  title: string ;
  price: number ;
  userId: string;
}

interface TicketDoc extends mongoose.Document { 
  title: string ;
  price: number ;
  userId: string ;
  version: number ;
  orderId?: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs):TicketDoc
}

const ticketSchema = new mongoose.Schema ({
  title:{
    type: String ,
    required: true
  },
  price:{
    type: Number ,
    required: true
  },
  userId:{
    type:String ,
    required: true
  },
  orderId:{
    type: String
  }
}, {
  toJSON: {
    transform(doc,ret){
      ret.id = ret._id;
      delete ret._id ;
    }
  }
});
// rename the __v property to version
ticketSchema.set('versionKey' , 'version');

//use the plugin
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc , TicketModel> ('Ticket', ticketSchema);

export {Ticket};