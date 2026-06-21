const request = require('supertest');
const app = require('../server');

describe('Auth endpoints', () => {
  it('POST /api/auth/register - debe registrar un usuario', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Usuario Test', email: 'usuario@test.com', password: '123456' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user');
  });

  it('POST /api/auth/login - debe loguear un usuario', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'usuario@test.com', password: '123456' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
  });
});
