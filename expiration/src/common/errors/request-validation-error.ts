import {ValidationError} from 'express-validator';
import {CustomError} from './custom-error';

export class RequestValidationError extends CustomError{

  statusCode = 400 ;

  constructor(public errors: ValidationError[]){
    super('Validation error')

    // only because we extend built in class we must do
    Object.setPrototypeOf(this,RequestValidationError.prototype)
  }

  serializeErrors(){
    return this.errors.map(err =>{
      return {message: err.msg , location: err.param}
    })
  }
}