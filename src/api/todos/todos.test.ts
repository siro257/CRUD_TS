import request from 'supertest';

import app from '../../app';
import { Todos } from './todos.model';

beforeAll(async () => {
  try {
    await Todos.drop();
  } catch (error) {}
});

describe('GET /api/v1/todos', () => {
  it('responds with an array of todos', async () =>
    request(app)
      .get('/api/v1/todos')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('length');
        expect(res.body.length).toBe(0);
      }));
});

let id = '';
describe('POST /api/v1/todos', () => {
  it('responds with an error if the todo is invalid', async () =>
    request(app)
      .post('/api/v1/todos')
      .set('Accept', 'application/json')
      .send({
        content: '',
      })
      .expect('Content-Type', /json/)
      .expect(422)
      .then((res) => {
        expect(res.body).toHaveProperty('message');
      }));
});

describe('POST /api/v1/todos', () => {
  it('responds with an inserted object', async () =>
    request(app)
      .post('/api/v1/todos')
      .set('Accept', 'application/json')
      .send({
        content: 'Learn TS',
        done: false,
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('_id');
        id = res.body._id;
        expect(res.body).toHaveProperty('content');
        expect(res.body.content).toBe('Learn TS');
        expect(res.body).toHaveProperty('done');
      }));
});

describe('GET /api/v1/todos/:id', () => {
  it('responds with a single todo', async () =>
    request(app)
      .get(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('_id');
        expect(res.body._id).toBe(id);
        expect(res.body).toHaveProperty('content');
        expect(res.body.content).toBe('Learn TS');
        expect(res.body).toHaveProperty('done');
      }));

  it('responds with a invalid ObjectId error', (done) => {
    request(app)
      .get('/api/v1/todos/asdasd')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });

  it('responds with a not found error', (done) => {
    request(app)
      .get('/api/v1/todos/631e7356ce07fecf7a92f43e')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
});

describe('PUT /api/v1/todos/:id', () => {
  it('responds with a invalid ObjectId error', (done) => {
    request(app)
      .put('/api/v1/todos/asdasd')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });

  it('responds with a not found error', (done) => {
    request(app)
      .put('/api/v1/todos/631e7356ce07fecf7a92f43e')
      .set('Accept', 'application/json')
      .send({
        content: 'LEARN TS',
        done: true,
      })
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('responds with a single todo', async () =>
    request(app)
      .put(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .send({
        content: 'Learn TS',
        done: true,
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('_id');
        expect(res.body._id).toBe(id);
        expect(res.body).toHaveProperty('content');
        expect(res.body.done).toBe(true);
      }));
});

describe('DELETE /api/v1/todos/:id', () => {
  it('responds with a invalid ObjectId error', (done) => {
    request(app).delete('/api/v1/todos/asdasd').set('Accept', 'application/json').expect(422, done);
  });

  it('responds with a not found error', (done) => {
    request(app)
      .delete('/api/v1/todos/631e7356ce07fecf7a92f43e')
      .set('Accept', 'application/json')
      .expect(404, done);
  });

  it('responds with a 204 status code', (done) => {
    request(app).delete(`/api/v1/todos/${id}`).set('Accept', 'application/json').expect(204, done);
  });
});
