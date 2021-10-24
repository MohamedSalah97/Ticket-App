import {useState} from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router'

export default  () =>{
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const {doRequest, errors} = useRequest({
    url:'/api/users/signup',
    methos: 'post',
    body:{
      email,password
    },
    onSuccess : () =>{
      Router.push('/');
    }
  })

  const onSubmit = async (e) =>{
    e.preventDefault();

    doRequest();
  }

  return <form onSubmit={onSubmit}>
    <h1>Sign Up</h1>
    <div className ='form-group'>
      <label>Email Address</label>
      <input className='form-control' value={email} onChange={e => setEmail(e.target.value)}  />
    </div>
    <div className ='form-group'>
      <label>Password</label>
      <input type='password' className='form-control' value={password} onChange={e=> setPassword(e.target.value)} />
    </div>
    {errors}
    <button className='btn btn-primary'>Sign Up</button>
  </form>
}