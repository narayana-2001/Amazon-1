import {formatCurrency} from '../../scripts/utils/money.js';

console.log('test suite: formatcurrency function');

console.log('Testing formatCurrency function...');
if (formatCurrency(2095) === '20.95') {
  console.log('Test passed!');
} else {
  console.log('failed');
}

console.log('Testing formatCurrency function with zero...');
if (formatCurrency(0) === '0.00') {
  console.log('Test passed!');
} else {
  console.log('failed');
}

console.log('Testing formatCurrency function with negative value...');
if (formatCurrency(2000.5) === '20.01') {
  console.log('Test passed!');
} else {
  console.log('failed');
}

console.log('Testing formatCurrency function with decimal value...');
if (formatCurrency(2000.4) === '20.00') {
  console.log('Test passed!');
} else {
  console.log('failed');
}

/* 16:20 */