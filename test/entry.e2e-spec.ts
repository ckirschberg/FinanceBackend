import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateEntryDto } from '../src/entry/dto/create-entry.dto';
import { Category } from '../src/categories/entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from '../src/categories/categories.service';
import { CreateCategoryDto } from '../src/categories/dto/create-category.dto';
import { Entry } from '../src/entry/entities/entry.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../src/users/users.service';
import { AuthService } from '../src/authentication/auth.service';
import { EntryService } from '../src/entry/entry.service';

describe('EntryController (e2e)', () => {
  let app: INestApplication;
  let categoriesService: CategoriesService;
  let entryRepository: Repository<Entry>
  let usersService: UsersService;
  let entryService: EntryService;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(EntryService)
    .useClass(MockEntryService)
    .compile();

    app = moduleFixture.createNestApplication();
    usersService = moduleFixture.get(UsersService);
    categoriesService = moduleFixture.get(CategoriesService);
    authService = moduleFixture.get(AuthService);
    entryService = moduleFixture.get(EntryService);
    entryRepository = moduleFixture.get(getRepositoryToken(Entry))
    entryRepository.query("DELETE FROM entry")

    app.useGlobalPipes(new ValidationPipe())
    await app.init();
  });

  describe('protected-endpoint', () => {
    it('should give access to admins', async () => {
        // Signup user
        // Login user
        // Access protected endpoint.
        const signedUpUser = await usersService.create('kirs', '1234');
      
        const {access_token} = await authService.login({username: 'kirs', password: '1234'});

        const {body} = await request(app.getHttpServer())
                            .post('/entry/protected-endpoint')
                            .auth(access_token, {type: 'bearer'})
                            .send()
                            
        expect(body.message).toEqual("You got through the gate")
    })
  })


  describe('/ (GET) entry controller', () => {
    it('should only get entries created/related to the user who is logged in', async () => {
        const signedUpUser = await usersService.create('kirs', '1234'); 
        const signedUpUser2 = await usersService.create('anotherUser', '1234'); 
        const {access_token} = await authService.login({username: 'kirs', password: '1234'});
        const savedCategory = await categoriesService.create(new CreateCategoryDto("Take-out"));

        const validEntry1 = new CreateEntryDto(100, new Date(), 'DKK', 'Umuts Pizza', 'I should not buy takeout', 'description', savedCategory, "");
        const validEntry2 = new CreateEntryDto(200, new Date(), 'DKK', 'Umuts Pizza', 'I should not buy takeout', 'description', savedCategory, "");
        const anotherUsersEntry = new CreateEntryDto(400, new Date(), 'DKK', 'Umuts Pizza', 'I should not buy takeout', 'description', savedCategory, "");
        await entryService.create(validEntry1, signedUpUser)
        await entryService.create(validEntry2, signedUpUser)
        await entryService.create(anotherUsersEntry, signedUpUser2)

        const {body} = await request(app.getHttpServer())
        .get('/entry')
        .auth(access_token, {type: 'bearer'})
        .expect(200)

        expect(body.length).toEqual(2)
    });
    })

    describe('/ (POST) entry controller', () => {
        it('should create a new entry when passed a valid entry if user is logged in', async () => {
            // Arrange
            const signedUpUser = await usersService.create('kirs', '1234');
            const {access_token} = await authService.login({username: 'kirs', password: '1234'});
            
            const savedCategory = await categoriesService.create(new CreateCategoryDto("Take-out"));
            // console.log("savedCategory", savedCategory);

            const validEntry = new CreateEntryDto(100, new Date(), 'DKK', 'Umuts Pizza', 'I should not buy takeout', 'description', savedCategory, "");
            // validEntry.category = savedCategory;

            // Act
            const {body} = await request(app.getHttpServer())
                .post('/entry')
                .send(validEntry)
                .auth(access_token, {type: 'bearer'})
                .expect(201)

                // console.log("savedEntry", body);
                
            expect(body.amount).toEqual(100);
            expect(body.id).toBeDefined();
        });
        it('should return 401 Unauthorized when saving entry without user beeing logged in', async () => {
            const inValidEntry = new CreateEntryDto(100, new Date(), 'DKK', '', 'I should not buy takeout', 'description');
        
            const {body} = await request(app.getHttpServer())
                .post('/entry')
                .send(inValidEntry)
                .expect(401)

        });

        it('should return error message when passed an invalid entry', async () => {
          const signedUpUser = await usersService.create('kirs', '1234');
          const {access_token} = await authService.login({username: 'kirs', password: '1234'});
          const inValidEntry = new CreateEntryDto(100, new Date(), 'DKK', '', 'I should not buy takeout', 'description');
      
          const {body} = await request(app.getHttpServer())
              .post('/entry')
              .auth(access_token, {type: 'bearer'})
              .send(inValidEntry)
              .expect(400)

          expect(body.message[0]).toEqual('name should not be empty')
      });

    })
});
