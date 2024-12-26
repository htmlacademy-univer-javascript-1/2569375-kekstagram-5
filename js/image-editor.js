import { sendData } from './api.js';
const MAX_HASHTAGS = 5;
const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const DEFAULT_SCALE = 100;
const SCALE_UPDATE = 100;
const MAX_DESCRIPTION_LENGTH = 140;
const HASHTAG_REGEX = /^#[A-Za-z0-9а-яё]{1,19}$/i;

const FormErrors = {
  COUNT_EXCEEDED: `Максимальное количество хэштегов — ${MAX_HASHTAGS}`,
  UNIQUE_HASHTAGS: 'Хэш-теги повторяются',
  INCORRECT_HASHTAG: 'Введен невалидный хэштег',
  LONG_DESCRIPTION: `Описание должно быть не длинее ${MAX_DESCRIPTION_LENGTH} символов`
};

const EffectSetups = {
  none: { filter: '', min: 0, max: 100, step: 1, unit: '' },
  chrome: { filter: 'grayscale', min: 0, max: 1, step: 0.1, unit: '' },
  sepia: { filter: 'sepia', min: 0, max: 1, step: 0.1, unit: '' },
  marvin: { filter: 'invert', min: 0, max: 100, step: 1, unit: '%' },
  phobos: { filter: 'blur', min: 0, max: 3, step: 0.1, unit: 'px' },
  heat: { filter: 'brightness', min: 1, max: 3, step: 0.1, unit: '' }
};

const DEFAULT_EFFECT = EffectSetups.none;
let chosenEffect = DEFAULT_EFFECT;

const elements = {
  uploadFileInput: document.getElementById('upload-file'),
  previewImage: document.querySelector('.img-upload__preview img'),
  form: document.querySelector('.img-upload__form'),
  fileField: document.querySelector('.img-upload__input'),
  overlay: document.querySelector('.img-upload__overlay'),
  body: document.querySelector('body'),
  hashtagsField: document.querySelector('.text__hashtags'),
  descriptionField: document.querySelector('.text__description'),
  closeButton: document.querySelector('.img-upload__cancel'),
  scaleControlSmaller: document.querySelector('.scale__control--smaller'),
  scaleControlBigger: document.querySelector('.scale__control--bigger'),
  scaleControlValue: document.querySelector('.scale__control--value'),
  imgUploadPreview: document.querySelector('.img-upload__preview img'),
  effectLevelValue: document.querySelector('.effect-level__value'),
  effectLevelSlider: document.querySelector('.effect-level__slider'),
  effectLevel: document.querySelector('.img-upload__effect-level'),
  submitButton: document.querySelector('.img-upload__submit'),
  successMessage: document.querySelector('#success').content.querySelector('.success'),
  errorMessage: document.querySelector('#error').content.querySelector('.error')
};

elements.uploadFileInput.addEventListener('change', () => {
  const file = elements.uploadFileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      elements.previewImage.src = reader.result;
      showForm();
    });
    reader.readAsDataURL(file);
  }
});

const pristine = new Pristine(elements.form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
});

function validateDescriptionLength(value) {
  return value.length <= MAX_DESCRIPTION_LENGTH || !value.length;
}

function splitHashtags(value) {
  return value.trim().split(/\s+/).filter((tag) => Boolean(tag.length));
}

function isCursorInInputField() {
  return document.activeElement === elements.hashtagsField ||
         document.activeElement === elements.descriptionField;
}

function validateHashtagCount(value) {
  return splitHashtags(value).length <= MAX_HASHTAGS;
}

function formPressESCHandler(evt) {
  if (evt.key === 'Escape' && !isCursorInInputField()) {
    evt.preventDefault();
    closeForm();
  }
}

function showForm() {
  elements.overlay.classList.remove('hidden');
  elements.body.classList.add('modal-open');
  document.addEventListener('keydown', formPressESCHandler);
}

function validateHashtags(value) {
  const hashtags = splitHashtags(value);
  return hashtags.length <= MAX_HASHTAGS && hashtags.every((tag) => HASHTAG_REGEX.test(tag));
}

pristine.addValidator(elements.hashtagsField, validateHashtags, FormErrors.INCORRECT_HASHTAG);

function validateDescription(value) {
  return !value.length || value.length <= MAX_DESCRIPTION_LENGTH;
}

pristine.addValidator(elements.descriptionField, validateDescription, FormErrors.LONG_DESCRIPTION);

function validateUniqueHashtags(value) {
  const hashtags = splitHashtags(value).map((tag) => tag.toLowerCase());
  return hashtags.length === new Set(hashtags).size;
}

function updateScale(value) {
  elements.scaleControlValue.value = `${value}%`;
  elements.imgUploadPreview.style.transform = `scale(${value / SCALE_UPDATE})`;
}

function onScaleControlSmallerClick() {
  const currentValue = parseInt(elements.scaleControlValue.value, 10);
  const newValue = Math.max(currentValue - SCALE_STEP, MIN_SCALE);
  updateScale(newValue);
}

function onScaleControlBiggerClick() {
  const currentValue = parseInt(elements.scaleControlValue.value, 10);
  const newValue = Math.min(currentValue + SCALE_STEP, MAX_SCALE);
  updateScale(newValue);
}

function resetScale() {
  updateScale(DEFAULT_SCALE);
}

function updateEffect() {
  if (chosenEffect === EffectSetups.none) {
    elements.imgUploadPreview.style.filter = '';
    elements.effectLevel.classList.add('hidden');
  } else {
    elements.effectLevel.classList.remove('hidden');
    const effectValue = elements.effectLevelSlider.noUiSlider.get();
    elements.imgUploadPreview.style.filter = `${chosenEffect.filter}(${effectValue}${chosenEffect.unit})`;
    elements.effectLevelValue.value = effectValue;
  }
}

function onEffectChange(evt) {
  if (evt.target.matches('input[type="radio"]')) {
    chosenEffect = EffectSetups[evt.target.value];
    elements.effectLevelSlider.noUiSlider.updateOptions({
      range: { min: chosenEffect.min, max: chosenEffect.max },
      step: chosenEffect.step,
      start: chosenEffect.max
    });
    updateEffect();
  }
}

function resetEffects() {
  chosenEffect = DEFAULT_EFFECT;
  updateEffect();
}

function closeForm() {
  elements.form.reset();
  pristine.reset();
  elements.fileField.value = '';
  elements.overlay.classList.add('hidden');
  elements.body.classList.remove('modal-open');
  document.removeEventListener('keydown', formPressESCHandler);
  resetScale();
  resetEffects();
}

function formFileIsSelectedHandler(evt) {
  if (evt.target.files.length) {
    showForm();
  }
}

elements.fileField.addEventListener('change', formFileIsSelectedHandler);

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape' && !isCursorInInputField()) {
    evt.preventDefault();
    closeForm();
  }
}

function hideMessage() {
  const messageElement = document.querySelector('.success') || document.querySelector('.error');
  messageElement.remove();
  document.removeEventListener('keydown', onDocumentKeydown);
  elements.body.removeEventListener('click', onBodyClick);
}

function onBodyClick(evt) {
  if (evt.target.closest('.success__inner') || evt.target.closest('.error__inner')) {
    return;
  }
  hideMessage();
}

function showMessage(messageElement, closeButtonClass) {
  elements.body.append(messageElement);
  document.addEventListener('keydown', onDocumentKeydown);
  elements.body.addEventListener('click', onBodyClick);
  messageElement.querySelector(closeButtonClass).addEventListener('click', hideMessage);
}

function showSuccessMessage() {
  showMessage(elements.successMessage, '.success__button');
}

function showErrorMessage(message) {
  const errorElement = elements.errorMessage.cloneNode(true);
  errorElement.querySelector('.error__title').textContent = message;
  showMessage(errorElement, '.error__button');
}

function onFormSubmit(evt) {
  evt.preventDefault();
  elements.submitButton.disabled = true; // Disable submit button
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
      elements.submitButton.disabled = false; // Re-enable button after submission
    });
}

elements.closeButton.addEventListener('click', closeForm);
elements.scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);
elements.scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);
document.addEventListener('keydown', onDocumentKeydown);

noUiSlider.create(elements.effectLevelSlider, {
  range: { min: DEFAULT_EFFECT.min, max: DEFAULT_EFFECT.max },
  start: DEFAULT_EFFECT.max,
  step: DEFAULT_EFFECT.step,
  connect: 'lower'
});

elements.effectLevelSlider.noUiSlider.on('update', updateEffect);
document.querySelector('.effects__list').addEventListener('change', onEffectChange);

pristine.addValidator(elements.descriptionField, validateDescriptionLength, FormErrors.LONG_DESCRIPTION);
pristine.addValidator(elements.hashtagsField, validateUniqueHashtags, FormErrors.UNIQUE_HASHTAGS);
pristine.addValidator(elements.hashtagsField, validateHashtags, FormErrors.INCORRECT_HASHTAG);
pristine.addValidator(elements.hashtagsField, validateHashtagCount, FormErrors.COUNT_EXCEEDED);

elements.form.addEventListener('submit', onFormSubmit);

elements.hashtagsField.addEventListener('input', () => {
  if (pristine.validate(elements.hashtagsField)) {
    pristine.reset();
  }
});

elements.descriptionField.addEventListener('input', () => {
  if (pristine.validate(elements.descriptionField)) {
    pristine.reset();
  }
});

document.querySelector('.img-filters__form').addEventListener('click', (evt) => {
  if (evt.target.matches('button')) {
    resetEffects();
    resetScale();
    pristine.reset();
  }
});

elements.closeButton.addEventListener('click', closeForm);
