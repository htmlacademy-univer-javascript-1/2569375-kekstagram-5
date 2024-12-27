const COMMENTS_PER_PAGE = 5;

const pictureContainer = document.querySelector('.big-picture');
const pictureImage = document.querySelector('.big-picture__img img');
const pictureCaption = document.querySelector('.social__caption');
const pictureLikesCount = document.querySelector('.likes-count');
const pictureCloseButton = document.querySelector('.big-picture__cancel');

const commentsContainer = document.querySelector('.social__comment-count');
const commentsCount = document.querySelector('.social__comment-total-count');
const commentsList = document.querySelector('.social__comments');
const commentsLoader = document.querySelector('.comments-loader');

const commentsRender = {
  currentComments: [],
  commentsShown: 0,
};

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
  commentsContainer.textContent = `${commentsRender.commentsShown} из ${commentsRender.currentComments.length} комментариев`;
};

const loadMoreComments = () => {
  const end = Math.min(commentsRender.commentsShown + COMMENTS_PER_PAGE, commentsRender.currentComments.length);
  const newComments = commentsRender.currentComments.slice(commentsRender.commentsShown, end);
  renderComments(newComments);
  commentsRender.commentsShown = end;
  updateCommentCount();

  if (commentsRender.commentsShown >= commentsRender.currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
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
  commentsRender.currentComments = data.comments;
  commentsRender.commentsShown = 0;
  commentsList.innerHTML = '';
  loadMoreComments(data);
  commentsContainer.classList.remove('hidden');
  commentsLoader.classList.toggle('hidden', commentsRender.currentComments.length <= COMMENTS_PER_PAGE);

  createListeners();
}

export { openBigPicture };
