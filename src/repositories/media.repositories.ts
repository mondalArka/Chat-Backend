import { Media } from 'src/entities/Media.entity';
import { InsertResult, Repository } from 'typeorm';

export class MediaRepository extends Repository<Media> {
  async saveMedia(body: Partial<Media>): Promise<Media> {
    const obj = this.create(body);
    return await this.save(obj);
  }

  async insertMedia(data: Array<Partial<Media>>): Promise<InsertResult> {
    return await this.insert(data);
  }
}
