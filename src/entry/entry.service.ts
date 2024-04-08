import { Injectable } from '@nestjs/common';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Entry } from './entities/entry.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';


@Injectable()
export class EntryService {

  constructor(@InjectRepository(Entry) 
    private entryRepository: Repository<Entry>,
    private readonly httpService: HttpService) {}


    async saveImage(base64EncodedImage: string): Promise<string> {
      const formData = new FormData();
        formData.append('image', base64EncodedImage);
        const { data: imageData } = await firstValueFrom(
          this.httpService
            .post(
              `https://freeimage.host/api/1/upload?key=${process.env.IMG_API_KEY}`,
              formData,
            )
            .pipe(
              catchError((error: AxiosError) => {
                console.log("error!!!!!");
                throw error;
              }),
            ),
        );
        return imageData.image.display_url;
    }


  create(createEntryDto: CreateEntryDto) {
    return this.entryRepository.save(createEntryDto)
  }

  findAll() {
    return this.entryRepository.find();
  }

  findOne(id: number) {
    return this.entryRepository.findOneBy({id})
  }

  update(id: number, updateEntryDto: UpdateEntryDto) {
    return this.entryRepository.update(id, updateEntryDto)
  }

  remove(id: number) {
    return this.entryRepository.delete(id);
  }
}
