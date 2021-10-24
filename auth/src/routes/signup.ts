import express,{Request,Response} from 'express' ;
import {User} from '../models/user';
import jwt from 'jsonwebtoken';
import {body} from 'express-validator' ;
import {BadRequestError} from './../common/errors/bad-request-error' ;
import {validateRequest} from './../common/middlewares/validate-request'; 


const router = express.Router();

router.post('/api/users/signup', [
  body('email').isEmail().withMessage('email must be valid'),
  body('password').trim().isLength({min:6 , max: 20}).withMessage('Password must be between 6 and 20 characters')
] ,validateRequest , async (req: Request,res: Response) =>{

  
  const {email,password} = req.body ;
  const foundUser = await User.findOne({email});
  if(foundUser){
    throw new BadRequestError('Email is used');
  }
 
  const user = User.build({email,password}) 
  await user.save();

  // make a user token 
  const userJwt = jwt.sign({
    email: user.email,
    id: user.id
  },process.env.JWT_KEY! )

  // put this token into a cookie session 
  req.session = {
    jwt: userJwt
  };
   
  res.status(201).send({user})
});  

export {router as signupRouter} ;