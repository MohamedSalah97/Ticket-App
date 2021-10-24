import {CustomError} from './custom-error' ;

export class DatabaseConnectionError extends CustomError {

  reason = 'Error connecting to database';
  statusCode = 500 ;

  constructor(){
    super('Error connecting to db')

    // only because we extend built in class we must do
    Object.setPrototypeOf(this,DatabaseConnectionError.prototype)
  }

  serializeErrors (){
    return [{
      message: this.reason
    }]
  }
}