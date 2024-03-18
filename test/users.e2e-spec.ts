import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm'
import { UserEntity } from '../src/authentication/entities/user';
import { UsersService } from '../src/users/users.service';
import { AuthService } from '../src/authentication/auth.service';
import { log } from 'console';

describe('ProblemController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let usersRepository: Repository<UserEntity>
  let usersService: UsersService
  let authService: AuthService
  let connection: Connection

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    usersService = moduleFixture.get(UsersService);
    authService = moduleFixture.get(AuthService);
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

    describe('Upgrade users', () => {
      it('should upgrade the role of the user to premium', async () => {
        const signedUpUser = await usersService.create('kirs', '1234');

        const {access_token} = await authService.login({username: 'kirs', password: '1234'});

        const {body} = await request(app.getHttpServer())
                            .post('/auth/upgrade')
                            .auth(access_token, {type: 'bearer'})
                            .send()
        
        expect(body.role).toEqual("premium")
        

        // expect(body.message).toEqual("You got through the gate")
      })
    })

    
  afterAll(() => {
    app.close();
  });
});
