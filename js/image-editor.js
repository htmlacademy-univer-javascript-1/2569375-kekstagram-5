import { sendData } from './api.js';

const MAX_HASHTAGS = 5;
const MAX_DESCRIPTION_LENGTH = 140;
const HASHTAG = /^#[A-Za-z0-9а-яё]{1,19}$/i;

const FormErrors = {
  COUNT_EXCEEDED: `Максимальное количество хэштегов — ${MAX_HASHTAGS}`,
  UNIQUE_HASHTAGS: 'Хэш-теги повторяются',
  INCORRECT_HASHTAG: 'Введен невалидный хэштег',
  LONG_DESCRIPTION: `Описание должно быть не длинее ${MAX_DESCRIPTION_LENGTH} символов`
};

const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const DEFAULT_SCALE = 100;

const EffectSetups = {
  none: {
    filter: '',
    min: 0,
    max: 100,
    step: 1,
    unit: ''
  },
  chrome: {
    filter: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  sepia: {
    filter: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  marvin: {
    filter: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%'
  },
  phobos: {
    filter: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px'
  },
  heat: {
    filter: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    unit: ''
  }
};

const DEFAULT_EFFECT = EffectSetups.none;
let chosenEffect = DEFAULT_EFFECT;

const form = document.querySelector('.img-upload__form');
const fileField = form.querySelector('.img-upload__input');
const overlay = form.querySelector('.img-upload__overlay');
const body = document.querySelector('body');
const hashtagsField = form.querySelector('.text__hashtags');
const descriptionField = form.querySelector('.text__description');
const closeButton = form.querySelector('.img-upload__cancel');
const scaleControlSmaller = document.querySelector('.scale__control--smaller');
const scaleControlBigger = document.querySelector('.scale__control--bigger');
const scaleControlValue = document.querySelector('.scale__control--value');
const imgUploadPreview = document.querySelector('.img-upload__preview img');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectLevel = document.querySelector('.img-upload__effect-level');
const submitButton = form.querySelector('.img-upload__submit');
const successMessage = document.querySelector('#success').content.querySelector('.success');
const errorMessage = document.querySelector('#error').content.querySelector('.error');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
});

const validateDescriptionLength = (value) => value.length <= MAX_DESCRIPTION_LENGTH;

const splitHashtags = (value) => value.trim().split(/\s+/).filter((tag) => Boolean(tag.length));

const isCursorInInputField = () => document.activeElement === hashtagsField || document.activeElement === descriptionField;

const validateHashtagCount = (value) => splitHashtags(value).length <= MAX_HASHTAGS;

const validateHashtags = (value) => splitHashtags(value).every((tag) => HASHTAG.test(tag));

const validateUniqueHashtags = (value) => {
  const hashtags = splitHashtags(value).map((tag) => tag.toLowerCase());
  return hashtags.length === new Set(hashtags).size;
};

const updateScale = (value) => {
  scaleControlValue.value = `${value}%`;
  imgUploadPreview.style.transform = `scale(${value / 100})`;
};

const onScaleControlSmallerClick = () => {
  const currentValue = parseInt(scaleControlValue.value, 10);
  const newValue = Math.max(currentValue - SCALE_STEP, MIN_SCALE);
  updateScale(newValue);
};

const onScaleControlBiggerClick = () => {
  const currentValue = parseInt(scaleControlValue.value, 10);
  const newValue = Math.min(currentValue + SCALE_STEP, MAX_SCALE);
  updateScale(newValue);
};

const resetScale = () => {
  updateScale(DEFAULT_SCALE);
};

const updateEffect = () => {
  if (chosenEffect === EffectSetups.none) {
    imgUploadPreview.style.filter = '';
    effectLevel.classList.add('hidden');
  } else {
    effectLevel.classList.remove('hidden');
    const effectValue = effectLevelSlider.noUiSlider.get();
    imgUploadPreview.style.filter = `${chosenEffect.filter}(${effectValue}${chosenEffect.unit})`;
    effectLevelValue.value = effectValue;
  }
};

const onEffectChange = (evt) => {
  if (evt.target.matches('input[type="radio"]')) {
    chosenEffect = EffectSetups[evt.target.value];
    effectLevelSlider.noUiSlider.updateOptions({
      range: {
        min: chosenEffect.min,
        max: chosenEffect.max
      },
      step: chosenEffect.step,
      start: chosenEffect.max
    });
    updateEffect();
  }
};

const resetEffects = () => {
  chosenEffect = DEFAULT_EFFECT;
  updateEffect();
};

const formPressESCHandler = (evt) => {
  if (evt.key === 'Escape' && !isCursorInInputField()) {
    evt.preventDefault();
    // eslint-disable-next-line no-use-before-define
    closeForm();
  }
};

const closeForm = () => {
  form.reset();
  pristine.reset();
  fileField.value = '';
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', formPressESCHandler);
  resetScale();
  resetEffects();
};

const showForm = () => {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', formPressESCHandler);
};

const formFileIsSelectedHandler = (evt) => {
  if (evt.target.files.length) {
    showForm();
  }
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape' && isCursorInInputField()) {
    evt.stopPropagation();
  }
};

function hideMessage() {
  const messageElement = document.querySelector('.success') || document.querySelector('.error');
  messageElement.remove();
  document.removeEventListener('keydown', onDocumentKeydown);
  body.removeEventListener('click', onBodyCLick);
}

function onBodyCLick(evt) {
  if (
    evt.target.closest('.success__inner') || evt.target.closest('.error__inner')
  ) {
    return;
  }
  hideMessage();
}

function showMessage(messageElement, closeButtonClass) {
  body.append(messageElement);
  document.addEventListener('keydown', onDocumentKeydown);
  body.addEventListener('click', onBodyCLick);
  messageElement.querySelector(closeButtonClass).addEventListener('click', hideMessage);
}

const showSuccessMessage = () => {
  showMessage(successMessage, '.success__button');
};

const showErrorMessage = (message) => {
  const errorElement = errorMessage.cloneNode(true);
  errorElement.querySelector('.error__title').textContent = message;
  showMessage(errorElement, '.error__button');
};

const onFormSubmit = (evt) => {
  evt.preventDefault();
  submitButton.disabled = true;

  const formData = new FormData(evt.target);

  sendData(formData)
    .then(() => {
      closeForm();
      showSuccessMessage();
    })
    .catch((error) => {
      showErrorMessage(error.message);
    })
    .finally(() => {
      submitButton.disabled = false;
    });
};

fileField.addEventListener('change', formFileIsSelectedHandler);
closeButton.addEventListener('click', closeForm);
scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);
scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);
document.addEventListener('keydown', onDocumentKeydown);

noUiSlider.create(effectLevelSlider, {
  range: {
    min: DEFAULT_EFFECT.min,
    max: DEFAULT_EFFECT.max
  },
  start: DEFAULT_EFFECT.max,
  step: DEFAULT_EFFECT.step,
  connect: 'lower'
});

effectLevelSlider.noUiSlider.on('update', () => updateEffect());
document.querySelector('.effects__list').addEventListener('change', onEffectChange);

pristine.addValidator(descriptionField, validateDescriptionLength, FormErrors.LONG_DESCRIPTION);
pristine.addValidator(hashtagsField, validateUniqueHashtags, FormErrors.UNIQUE_HASHTAGS);
pristine.addValidator(hashtagsField, validateHashtags, FormErrors.INCORRECT_HASHTAG);
pristine.addValidator(hashtagsField, validateHashtagCount, FormErrors.COUNT_EXCEEDED);

form.addEventListener('submit', onFormSubmit);
