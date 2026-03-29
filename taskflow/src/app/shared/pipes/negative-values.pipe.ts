import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'negativeValues',
})
export class NegativeValuesPipe implements PipeTransform {
  transform(value: string): string {
    if (value === 'income') {
      return 'text-success';
    }
    if (value === 'expense') {
      return 'text-danger';
    }

    return '';
  }
}
