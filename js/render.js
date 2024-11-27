export const renderPictures = (pictures) => {
  const template = document.querySelector('#picture').content;
  const picturesContainer = document.querySelector('.pictures');

  pictures.forEach(({ url, description, likes, comments }) => {
    const pictureElement = template.cloneNode(true);
    pictureElement.querySelector('img').src = url;
    pictureElement.querySelector('img').alt = description;
    pictureElement.querySelector('.picture__likes').textContent = likes;
    pictureElement.querySelector('.picture__comments').textContent = comments.length;
    picturesContainer.appendChild(pictureElement);
  });
};
