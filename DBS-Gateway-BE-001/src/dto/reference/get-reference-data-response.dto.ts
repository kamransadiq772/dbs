import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/ApiResponse.dto';

export class GetReferenceDataResponseDto extends ApiResponseDto {
  @ApiProperty({ example: 'reference_data_success' })
  message;
  @ApiProperty({
    example: {
      ribbons: [],
      badges: [],
      allergens: [],
      food_types: [],
      dietary_attribures: [],
      optional_trainings: [],
      mandatory_trainings: [],
      cuisines: [],
    },
  })
  data: {
    ribbons: [];
    badges: [];
    allergens: [];
    food_types: [];
    dietary_attribures: [];
    optional_trainings: [];
    mandatory_trainings: [];
    cuisines: [];
  };
  @ApiProperty({ example: 'null' })
  errors;
}
