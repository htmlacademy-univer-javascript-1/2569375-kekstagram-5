import { openBigPicture } from './bigpicture.js';
import { getPhotos } from './data.js';
import { init } from './filters.js';

const thumbnailTemplate = document.querySelector('#picture').content.querySelector('.picture');
const container = document.querySelector('.pictures');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');
const errorButton = errorTemplate.querySelector('.error__button');
const body = document.querySelector('body');

const createThumbnail = ({ url, description, likes, comments, id }) => {
  const thumbnail = thumbnailTemplate.cloneNode(true);

  thumbnail.querySelector('.picture__img').src = url;
  thumbnail.querySelector('.picture__img').alt = description;
  thumbnail.querySelector('.picture__likes').textContent = likes;
  thumbnail.querySelector('.picture__comments').textContent = comments.length;
  thumbnail.dataset.thumbnailId = id;

  thumbnail.addEventListener('click', (evt) => {
    evt.preventDefault();
    openBigPicture({ url, description, likes, comments, id });
  });

  return thumbnail;
};

const showError = (message) => {
  const errorElement = errorTemplate.cloneNode(true);
  errorElement.querySelector('.error__title').textContent = message;
  errorButton.addEventListener('click', () => {
    errorElement.remove();
  });
  body.append(errorElement);
};

const renderFilteredThumbnails = (filteredPhotos) => {
  const thumbnails = container.querySelectorAll('.picture');
  thumbnails.forEach((thumbnail) => {
    container.removeChild(thumbnail);
  });

  filteredPhotos.forEach((photo) => {
    container.append(createThumbnail(photo));
  });
};

const renderThumbnails = async () => {
  try {
    const photos = await getPhotos();
    photos.forEach((photo) => {
      container.append(createThumbnail(photo));
    });
    init(photos, renderFilteredThumbnails);
  } catch (error) {
    showError(error.message);
  }
};

export { renderThumbnails };
