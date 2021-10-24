import request from 'supertest';
import {app} from '../../app';

it('returns 201 on successful signup', async ()=>{
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password:'password'
    })
    .expect(201)
})

it('returns 400 with unvalid email', async() =>{
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'thghfjk',
      password:'password'
    })
    .expect(400)
})

it('returns 400 with unvalid password', async() =>{
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@tes.com',
      password:'1'
    })
    .expect(400)
})


it('returns 400 with no email or password', async() =>{
  return request(app)
    .post('/api/users/signup')
    .send({})
    .expect(400)
});

it('sets a cookie after signup successfully', async () => {
  const response = await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password:'password'
  })
  .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
})