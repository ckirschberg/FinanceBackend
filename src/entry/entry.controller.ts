import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EntryService } from './entry.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { AdminGuard } from '../authentication/admin.guard';

@Controller('entry')
export class EntryController {
  constructor(private readonly entryService: EntryService) {}



  @UseGuards(JwtAuthGuard)
  @Post("protected-endpoint")
  testProtectedEndpoint() {
    console.log("You got through the gate");
    return { message: "You got through the gate" }
  }

  // @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createEntryDto: CreateEntryDto) {
    
    const display_url = await this.entryService.saveImage(createEntryDto.photo.base64);
    createEntryDto.photo = display_url; //just save the url to the image in our database.

    return this.entryService.create(createEntryDto);
  }

  
  @Get()
  findAll() {
    return this.entryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntryDto: UpdateEntryDto) {
    return this.entryService.update(+id, updateEntryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entryService.remove(+id);
  }
}
