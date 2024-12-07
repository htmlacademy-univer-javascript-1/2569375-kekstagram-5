const bigPictureElement = document.querySelector('.big-picture');
const body = document.body;
const cancelButton = bigPictureElement.querySelector('#picture-cancel');
const commentsLoader = bigPictureElement.querySelector('.comments-loader');

let pictureArray = [];

const openBigPicture = (pictureData) => {
  bigPictureElement.classList.remove('hidden');

  const img = bigPictureElement.querySelector('.big-picture__img img');
  img.src = pictureData.url;
  img.alt = pictureData.description;

  const likesCount = bigPictureElement.querySelector('.likes-count');
  likesCount.textContent = pictureData.likes;

  const commentsCount = bigPictureElement.querySelector('.comments-count');
  commentsCount.textContent = pictureData.commentCount;

  const socialCaption = bigPictureElement.querySelector('.social__caption');
  socialCaption.textContent = pictureData.description;

  const commentsList = bigPictureElement.querySelector('.social__comments');
  commentsList.innerHTML = '';

  pictureData.comments.forEach(({ avatar, name, message }) => {
    const commentItem = document.createElement('li');
    commentItem.className = 'social__comment';
    commentItem.innerHTML = `
      <img class="social__picture" src="${avatar}" alt="${name}" width="35" height="35">
      <p class="social__text">${message}</p>
    `;
    commentsList.appendChild(commentItem);
  });

  const commentCountElement = bigPictureElement.querySelector('.social__comment-count');
  commentCountElement.classList.add('hidden');
  commentsLoader.classList.add('hidden');

  body.classList.add('modal-open');
};

const closeBigPicture = () => {
  bigPictureElement.classList.add('hidden');
  body.classList.remove('modal-open');
};

cancelButton.addEventListener('click', closeBigPicture);
document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    closeBigPicture();
  }
});

export const initializeBigPicture = () => {
  const picturesContainer = document.querySelector('.pictures');
  picturesContainer.addEventListener('click', (evt) => {
    const pictureElement = evt.target.closest('.picture');

    if (pictureElement) {
      const index = parseInt(pictureElement.dataset.index, 10);

      if (index >= 0 && index < pictureArray.length) {
        const pictureData = pictureArray[index];
        openBigPicture(pictureData);
      }
    }
  });
};

export const setPictureArray = (pictures) => {
  pictureArray = pictures;
};

