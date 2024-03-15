import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm'
import { UserEntity } from '../src/authentication/entities/user';
import { UsersService } from '../src/users/users.service';

describe('ProblemController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let usersRepository: Repository<UserEntity>
  let usersService: UsersService
  let connection: Connection

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    usersService = moduleFixture.get(UsersService);
    usersRepository = moduleFixture.get(getRepositoryToken(UserEntity))
    usersRepository.query("DELETE FROM user_entity")

    connection = moduleFixture.get(Connection)
    app = moduleFixture.createNestApplication();
    await app.init();
  });


    describe('Signup', () => {
        it('should create a user', async () => {
          const user = { username: 'chr', password: '1234' };

            // Act
          const {body} = await request(app.getHttpServer())
                            .post('/auth/signup')
                            .send(user)
                            .expect(201)

        //   console.log(body);
                            
          expect(body.username).toEqual("chr");
          expect(body.role).toEqual("user");
          expect(body.id).toBeDefined();
        });
    })

    describe('Login', () => {
        it('should login and get a token', async () => {
          const createdUser = await usersService.create('chr', "1234");

          const login = { username: 'chr', password: '1234'}
            // Act
          const {body} = await request(app.getHttpServer())
                            .post('/auth/login')
                            .send(login)
                            .expect(201)

                            
          expect(body.access_token).toBeDefined()
        });
    })

    
  afterAll(() => {
    app.close();
  });
});
