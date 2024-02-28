'user strict';

const form = document.querySelector('#bookmarker-form');
const bookmarkContainer = document.querySelector('#bookmarks-container');
const modalTriggerBtn = document.querySelector('#modal-trigger');
const modal = document.querySelector('#modal');
const modalCloseBtn = document.querySelector('#modal-close');

let bookmarks = [];

function deleteItem(e) {
	const deleteBtn = e.target.closest('.fa-close');

	if (deleteBtn) {
		const id = deleteBtn.closest('.item').id;
		bookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
		localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

		getBookmarks();
	}
}

function createItemHTML(bookmark) {
	const { id, name, url } = bookmark;
	const htmlContent = `
		<li class="item" id=${id}>
			<i class="fas fa-close" id="delete-bookmark-btn" title="Delete bookmark"></i>
			<div class="name">
				<img
					src="https://s2.googleusercontent.com/s2/favicons?domain=${url}/" 
					alt="Favicon" />
				<a href=${url} target="_black">${name}</a>
			</div>
		</li>`;

	return htmlContent.trim();
}

function buildBookmarksDOM() {
	const items = bookmarks.map((bookmark) => createItemHTML(bookmark));
	return (bookmarkContainer.innerHTML = items.join(''));
}

function getBookmarks() {
	if (localStorage.getItem('bookmarks')) {
		bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
	} else {
		bookmarks = [{ id: self.crypto.randomUUID(), name: 'Jane Portfolio', url: 'https://janepark87.github.io/3d-portfolio/' }];
		localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
	}

	buildBookmarksDOM();
}

function validate(name, url) {
	// validate the url pattern
	const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
	const regex = new RegExp(urlRegex);
	if (!name || !url) return alert('Please provide website name and URL.');
	if (!url.match(regex)) return alert('Invalid url. Please provide a valid web address');

	// valid
	return true;
}

function submitHandler(e) {
	e.preventDefault();

	const formData = {
		id: self.crypto.randomUUID(),
		name: form.name.value.trim(),
		url: !form.url.value.includes('http://') || !form.url.value.includes('https://') ? `https://${form.url.value.trim()}` : form.url.value.trim(),
	};

	if (!validate(formData.name, formData.url)) return;

	// save the form data
	bookmarks.push(formData);
	localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

	buildBookmarksDOM();

	form.reset();
	form.name.focus();
}

function openModal() {
	modal.classList.add('open');
	form.name.focus();
}

function closeModal() {
	modal.classList.remove('open');
	form.reset();
}

modalTriggerBtn.addEventListener('click', openModal);
modalCloseBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => e.target.classList.contains('modal') && closeModal());

form.addEventListener('submit', submitHandler);
bookmarkContainer.addEventListener('click', deleteItem);

// on load, fetch the bookmarks' data from the local storage
getBookmarks();
