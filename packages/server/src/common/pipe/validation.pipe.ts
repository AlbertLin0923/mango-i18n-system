import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    // Account for an empty request body
    if (value == null) {
      value = {};
    }

    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // console.log('value', value);

    // 将对象转换为 Class 来验证
    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      console.log('errors', errors);
      // Top-level errors
      const topLevelErrors = errors
        .filter((v) => v.constraints)
        .map((error) => {
          return {
            property: error.property,
            constraints: Object.values(error.constraints),
          };
        });

      // Nested errors
      const nestedErrors = errors
        .filter((v) => !v.constraints)
        .map((error) => {
          const validationErrors = this.getValidationErrorsFromChildren(
            error.property,
            error.children,
          );
          return validationErrors;
        });

      throw new BadRequestException({
        message: 'Validation failed',
        meta: topLevelErrors.concat(...nestedErrors),
      });
    }

    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private getValidationErrorsFromChildren(parent, children, errors = []) {
    children.forEach((child) => {
      if (child.constraints) {
        errors.push({
          property: `${parent}.${child.property}`,
          constraints: Object.values(child.constraints),
        });
      } else {
        return this.getValidationErrorsFromChildren(
          `${parent}.${child.property}`,
          child.children,
          errors,
        );
      }
    });
    return errors;
  }
}
