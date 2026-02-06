import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';

/**
 * MongoDB ObjectId Validation Pipe
 * Validates that a string is a valid 24-character MongoDB ObjectId
 * Returns 400 Bad Request if invalid (instead of 500 Internal Server Error)
 */
@Injectable()
export class MongoIdPipe implements PipeTransform<string> {
  transform(value: string): string {
    // Check if value is a valid MongoDB ObjectId (24 hex characters)
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid ID format');
    }
    
    return value;
  }
}
