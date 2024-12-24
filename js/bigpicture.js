const pictureContainer = document.querySelector('.big-picture');
const pictureImage = document.querySelector('.big-picture__img img');
const pictureCaption = document.querySelector('.social__caption');
const pictureLikesCount = document.querySelector('.likes-count');
const pictureCloseButton = document.querySelector('.big-picture__cancel');

const commentsContainer = document.querySelector('.social__comment-count');
const commentsCount = document.querySelector('.comments-count');
const commentsList = document.querySelector('.social__comments');
const commentsLoader = document.querySelector('.comments-loader');

let currentComments = [];
let commentsShown = 0;

const COMMENTS_PER_PAGE = 5;

const onCloseButtonClick = () => {
  closeBigPicture();
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape' && !evt.target.closest('.social__footer-text')) {
    closeBigPicture();
  }
};

const renderComments = (comments) => {
  const fragment = document.createDocumentFragment();

  comments.forEach(({ avatar, message, name }) => {
    const commentElement = document.createElement('li');
    commentElement.classList.add('social__comment');

    const imgElement = document.createElement('img');
    imgElement.classList.add('social__picture');
    imgElement.src = avatar;
    imgElement.alt = name;
    imgElement.width = 35;
    imgElement.height = 35;

    const textElement = document.createElement('p');
    textElement.classList.add('social__text');
    textElement.textContent = message;

    commentElement.appendChild(imgElement);
    commentElement.appendChild(textElement);

    fragment.appendChild(commentElement);
  });

  commentsList.appendChild(fragment);
};

const updateCommentCount = () => {
  commentsContainer.textContent = `${commentsShown} из ${currentComments.length}`;
};

const loadMoreComments = () => {
  const end = Math.min(commentsShown + COMMENTS_PER_PAGE, currentComments.length);
  const newComments = currentComments.slice(commentsShown, end);
  renderComments(newComments);
  commentsShown = end;
  updateCommentCount();

  if (commentsShown >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  }
};

const removeListeners = () => {
  pictureCloseButton.removeEventListener('click', onCloseButtonClick);
  document.removeEventListener('keydown', onDocumentKeydown);
  commentsLoader.removeEventListener('click', loadMoreComments);
};

const createListeners = () => {
  pictureCloseButton.addEventListener('click', onCloseButtonClick);
  document.addEventListener('keydown', onDocumentKeydown);
  commentsLoader.addEventListener('click', loadMoreComments);
};

const fillBigPicture = (data) => {
  pictureImage.src = data.url;
  pictureLikesCount.textContent = data.likes;
  commentsCount.textContent = data.comments.length;
  pictureCaption.textContent = data.description;
};

function closeBigPicture () {
  pictureContainer.classList.add('hidden');
  document.body.classList.remove('modal-open');

  removeListeners();
}

function openBigPicture (data) {
  pictureContainer.classList.remove('hidden');
  document.body.classList.add('modal-open');

  fillBigPicture(data);
  currentComments = data.comments;
  commentsShown = 0;
  commentsList.innerHTML = '';
  loadMoreComments();
  commentsContainer.classList.remove('hidden');

  if (currentComments.length > COMMENTS_PER_PAGE) {
    commentsLoader.classList.remove('hidden');
  } else {
    commentsLoader.classList.add('hidden');
  }

  createListeners();
}

export { openBigPicture };
