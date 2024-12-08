const validateHashtags = (value) => {
  const hashtags = value.split(' ').map((tag) => tag.trim().toLowerCase()).filter(Boolean);
  const uniqueHashtags = new Set(hashtags);

  if (hashtags.length === 0) {
    return 'Должен быть хотя бы один хэш-тег';
  }

  if (hashtags.length > 5) {
    return 'Нельзя указать больше пяти хэш-тегов';
  }

  if (hashtags.length !== uniqueHashtags.size) {
    return 'Хэш-теги не должны повторяться';
  }

  for (const tag of hashtags) {
    if (!/^#[A-Za-z0-9а-яА-Я]{1,19}$/.test(tag)) {
      return 'Хэш-тег должен начинаться с # и состоять только из букв и цифр. Он не может содержать пробелы или спецсимволы.';
    }
  }

  return true;
};

const validateComment = (value) => {
  if (value.length > 140) {
    return 'Комментарий не может содержать больше 140 символов';
  }
  return true;
};

const pristine = new Pristine(document.getElementById('upload-select-image'), {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'is-invalid',
  successClass: 'is-valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'text-help'
});

// Обновляем валидаторы, чтобы использовать текст ошибки из функции валидации
pristine.addValidator(
  document.querySelector('.text__hashtags'),
  (value) => validateHashtags(value) === true,
  (value) => validateHashtags(value)
);

pristine.addValidator(
  document.querySelector('.text__description'),
  (value) => validateComment(value) === true,
  (value) => validateComment(value)
);

const uploadForm = document.getElementById('upload-select-image');

uploadForm.addEventListener('submit', (evt) => {
  if (!pristine.validate()) {
    evt.preventDefault();
  }
});

const uploadFileInput = document.querySelector('#upload-file');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('#upload-cancel');

uploadFileInput.addEventListener('change', () => {
  overlay.classList.remove('hidden');
});

const closeForm = () => {
  overlay.classList.add('hidden');
  uploadFileInput.value = '';
  document.querySelector('.text__hashtags').value = '';
  document.querySelector('.text__description').value = '';
  pristine.reset();
};

cancelButton.addEventListener('click', closeForm);

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape' && document.activeElement !== document.querySelector('.text__hashtags') && document.activeElement !== document.querySelector('.text__description')) {
    closeForm();
  }
});

export default pristine;
