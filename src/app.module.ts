import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EntryModule } from './entry/entry.module';
import { dbConfig } from '../data.source';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './authentication/auth.module';

@Module({
 imports: [
   ConfigModule.forRoot({ isGlobal: true }),
   // Directly use dataSource for TypeORM configuration
   TypeOrmModule.forRoot(dbConfig), 
   EntryModule,
   CategoriesModule,
   AuthModule,
 ],
 controllers: [AppController],
 providers: [AppService],
})
export class AppModule {}