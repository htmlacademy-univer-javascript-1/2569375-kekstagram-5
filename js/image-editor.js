const scaleInput = document.querySelector('.scale__control--value');
const previewImage = document.querySelector('.img-upload__preview img');
const effectLevelInput = document.querySelector('.effect-level__value');
const effectSlider = document.querySelector('.effect-level__slider');
const effects = document.querySelectorAll('.effects__radio');
const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');

// Сброс значений по умолчанию
const resetEffect = () => {
  effectLevelInput.value = 100; // Устанавливаем значение по умолчанию
  previewImage.style.filter = '';
  effectSlider.noUiSlider.set(100); // Сброс уровня насыщенности
};

// Функция для применения эффекта
const applyEffect = (effect) => {
  const value = effectLevelInput.value; // Получаем значение уровня эффекта
  switch (effect) {
    case 'chrome':
      previewImage.style.filter = `grayscale(${value}%)`;
      break;
    case 'sepia':
      previewImage.style.filter = `sepia(${value}%)`;
      break;
    case 'marvin':
      previewImage.style.filter = `invert(${value}%)`;
      break;
    case 'phobos':
      previewImage.style.filter = `blur(${value / 10}px)`;
      break;
    case 'heat':
      previewImage.style.filter = `brightness(${value / 25})`; // Изменяем значение для эффекта heat
      break;
    case 'none':
      previewImage.style.filter = '';
      break;
  }
};

// Инициализация слайдера для уровней эффекта
noUiSlider.create(effectSlider, {
  range: { min: 0, max: 100 }, // Задаем диапазон от 0 до 100
  start: 0, // Начальное значение 100%
  step: 1, // Шаг изменения значений
  connect: 'lower',
});

effectSlider.noUiSlider.on('update', (values, handle) => {
  effectLevelInput.value = values[handle]; // Обновляем значение эффекта
  const currentEffect = document.querySelector('.effects__radio:checked').value;
  applyEffect(currentEffect);
});

// Обработка изменения масштаба
const changeScale = (change) => {
  let currentValue = parseInt(scaleInput.value, 10);
  currentValue += change;
  if (currentValue < 25) {
    currentValue = 25;
  } else if (currentValue > 100) {
    currentValue = 100;
  }
  scaleInput.value = `${currentValue}%`;
  previewImage.style.transform = `scale(${currentValue / 100})`;
};

// Изменение масштаба при нажатии кнопок
scaleSmaller.addEventListener('click', () => changeScale(-25));
scaleBigger.addEventListener('click', () => changeScale(25));

// Сброс и применение эффекта при переключении фильтров
effects.forEach((effect) => {
  effect.addEventListener('change', (evt) => {
    const selectedEffect = evt.target.value;
    resetEffect();
    if (selectedEffect !== 'none') {
      effectSlider.classList.remove('hidden');
      effectSlider.noUiSlider.updateOptions({
        range: { min: 0, max: 100 },
        start: 0, // Устанавливаем начальное значение на 100 для всех эффектов
        step: 1, // Шаг
      });
    } else {
      effectSlider.classList.add('hidden');
    }
    effectLevelInput.value = 100; // Устанавливаем значение по умолчанию на 100
  });
});

// При загрузке изображения сброс значений
document.querySelector('#upload-file').addEventListener('change', () => {
  scaleInput.value = '100%';
  previewImage.style.transform = 'scale(1)';
  resetEffect();
});

