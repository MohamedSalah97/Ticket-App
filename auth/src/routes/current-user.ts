import express from 'express' ;
import {currentUser} from './../common/middlewares/current-user';


const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req,res) =>{
  
  const {currentUser} = req;

  res.send({currentUser: currentUser || null});

});

export {router as currentUserRouter} ;