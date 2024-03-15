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

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let categoriesService: CategoriesService;
  let entryRepository: Repository<Entry>

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    categoriesService = moduleFixture.get(CategoriesService);
    entryRepository = moduleFixture.get(getRepositoryToken(Entry))
    entryRepository.query("DELETE FROM entry")

    app.useGlobalPipes(new ValidationPipe())
    await app.init();
  });

  describe('/ (GET) entry controller', () => {
    it('/ (GET)', () => {
        return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
    })

    describe('/ (POST) entry controller', () => {
        it('should create a new entry when passed a valid entry', async () => {
            // Arrange
            const savedCategory = await categoriesService.create(new CreateCategoryDto("Take-out"));
            // console.log("savedCategory", savedCategory);

            const validEntry = new CreateEntryDto(100, new Date(), 'DKK', 'Umuts Pizza', 'I should not buy takeout', 'description', savedCategory);
            // validEntry.category = savedCategory;

            // Act
            const {body} = await request(app.getHttpServer())
                .post('/entry')
                .send(validEntry)
                .expect(201)

                // console.log("savedEntry", body);
                
            expect(body.amount).toEqual(100);
            expect(body.id).toBeDefined();
        });
        it('should return error message when passed an invalid entry', async () => {
            const inValidEntry = new CreateEntryDto(100, new Date(), 'DKK', '', 'I should not buy takeout', 'description');
        
            const {body} = await request(app.getHttpServer())
                .post('/entry')
                .send(inValidEntry)
                .expect(400)

            expect(body.message[0]).toEqual('name should not be empty')
        });
    })
});
