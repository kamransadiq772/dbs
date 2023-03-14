import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICitySchema } from '../interfaces/cites.interfaces';
export class CityService {
  constructor(
    @InjectModel('Cities')
    private readonly cityModel: Model<ICitySchema>,
  ) {}
  
  public async get_cities(country_name: string): Promise<any> {
    try {
      return await this.cityModel.find(
        { country: { $regex: country_name.toLowerCase(), $options: 'i' } },
        { city_name: 1 },
      );
    } catch (err) {
      throw err;
    }
  }
 
}