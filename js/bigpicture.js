const bigPictureElement = document.querySelector('.big-picture');
const body = document.body;
const cancelButton = bigPictureElement.querySelector('#picture-cancel');
const commentsLoader = bigPictureElement.querySelector('.comments-loader');
const commentsList = bigPictureElement.querySelector('.social__comments');

let pictureArray = [];
let currentCommentIndex = 0;
const commentsPerLoad = 5;

const displayComments = (comments) => {
  const remainingComments = comments.slice(currentCommentIndex, currentCommentIndex + commentsPerLoad);

  remainingComments.forEach(({ avatar, name, message }) => {
    const commentItem = document.createElement('li');
    commentItem.className = 'social__comment';
    commentItem.innerHTML = `
      <img class="social__picture" src="${avatar}" alt="${name}" width="35" height="35">
      <p class="social__text">${message}</p>
    `;
    commentsList.appendChild(commentItem);
  });

  currentCommentIndex += commentsPerLoad;

  const commentCountElement = bigPictureElement.querySelector('.social__comment-count');
  const totalDisplayed = Math.min(currentCommentIndex, comments.length);
  commentCountElement.textContent = `${totalDisplayed} из ${comments.length} комментариев`;

  if (currentCommentIndex >= comments.length) {
    commentsLoader.classList.add('hidden');
  }
};

const openBigPicture = (pictureData) => {
  bigPictureElement.classList.remove('hidden');

  const img = bigPictureElement.querySelector('.big-picture__img img');
  img.src = pictureData.url;
  img.alt = pictureData.description;

  const likesCount = bigPictureElement.querySelector('.likes-count');
  likesCount.textContent = pictureData.likes;

  const socialCaption = bigPictureElement.querySelector('.social__caption');
  socialCaption.textContent = pictureData.description;

  currentCommentIndex = 0;
  commentsList.innerHTML = '';

  displayComments(pictureData.comments);

  const commentCountElement = bigPictureElement.querySelector('.social__comment-count');
  commentCountElement.classList.remove('hidden');
  commentCountElement.textContent = `${Math.min(pictureData.commentCount, commentsPerLoad)} из ${pictureData.commentCount} комментариев`;

  if (pictureData.commentCount <= commentsPerLoad) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }

  body.classList.add('modal-open');

  commentsLoader.onclick = () => {
    displayComments(pictureData.comments);
  };
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

