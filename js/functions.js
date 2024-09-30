function checkLenght (string, maxLength) {
  return string.length <= maxLength;
}

checkLenght('проверяемая строка', 20); // true
checkLenght('проверяемая строка', 18); // true
checkLenght('проверяемая строка', 10); // false

function palindrome (string) {
  const newString = string.replaceAll(' ', '').toUpperCase();
  const reverseNewString = [...newString].reverse().join('');
  return reverseNewString === newString;
}

palindrome('Лёша на полке клопа нашёл '); // true


