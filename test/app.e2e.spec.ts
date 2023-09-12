import { Test } from '@nestjs/testing';
import { TestingModule } from './testing.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { User } from '../src/users/user.entity';
import { createUserReturnToken } from './helper';

//TODO THE GOOD PRACTICE THAT MAKE EVERY TEST RUN INDEPENDENTLY
describe('(e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let token: string;
  let moduleFixture;
  let UserId: number;
  const userExample = {
    email: 'admin@gmail.com',
    password: '123456',
    //TODO add role to admin
  };

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [TestingModule],
    }).compile();
    userRepository = moduleFixture.get('UserRepository');
    app = moduleFixture.createNestApplication();
    await app.init();
    token = await createUserReturnToken(app, userExample);
  });

  it('should get user', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
        query getProfile {
          me{
            email
          }
        }
        `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.me.email).toBe(userExample.email);
      });
  });

  afterAll(async () => {
    await userRepository.delete({});
    await app.close();
  });
});
