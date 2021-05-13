const textarea = document.querySelector('.textArea');
const saveButton = document.querySelector('.saveBtn');
const boldButton = document.querySelector('.boldBtn');
const italicButton = document.querySelector('.italicBtn');
const bulletButton = document.querySelector('.bulletBtn');
const fileInput = document.querySelector('.fileInput');
const notification = document.querySelector('.notification');
const notificationWrapper = document.querySelector('.notificationWrapper');
let notificationTimeout = null;

const format = (command, value) => {
	textarea.focus();
	document.execCommand(command, false, value);
};

// save data to file using browser api:
const download = (content, fileName, contentType) => {
	const a = document.createElement('a');
	const file = new Blob([content], { type: contentType });
	a.href = URL.createObjectURL(file);
	a.download = fileName;
	a.click();
};

const handleSaveFile = () => {
	const userInput = document.querySelector('.textArea').innerHTML;
	// create JSON and parse to string:
	const obj = { data: '' };
	obj.data = userInput;
	const resultJson = JSON.stringify(obj);
	download(resultJson, 'data.json', 'application/json');
};

const renderNotification = (message) => {
	notification.innerHTML = `File upload ${message} <i class="fas fa-times"></i>`;
	notificationWrapper.style.display = 'block';
	notificationWrapper.style.opacity = '1';
	if (message === 'type error') {
		notification.innerHTML = `Only json files are allowed. Try again with json file. <i class="fas fa-times"></i>`;
	}
	notification.classList.add('showNotification');
	// reset input after timeout
	notificationTimeout = setTimeout(() => {
		notification.classList.remove('showNotification');
		notificationWrapper.style.display = 'none';
		fileInput.value = '';
	}, 6000);
	const closeBtn = document.querySelector('.fa-times');
	// reset input aftet click close button:
	closeBtn.addEventListener('click', () => {
		notification.classList.remove('showNotification');
		notificationWrapper.style.display = 'none';
		clearTimeout(notificationTimeout);
		fileInput.value = '';
		console.log(fileInput);
	});
};

const handleUploadFile = (input) => {
	console.log(input);
	const fileType = input.target.files[0].type;
	if (fileType !== 'application/json') {
		notification.style.backgroundColor = '#f00';
		return renderNotification('type error');
	}
	const file = input.target.files[0];
	console.log(file);
	const fileName = input.target.files[0].name;
	const reader = new FileReader();

	reader.readAsText(file);
	reader.onload = function () {
		console.log('upload');
		const userInput = document.querySelector('.textArea');
		const fileNameLabel = document.querySelector('.fileName');
		// parse txt content file to JSON:
		const resultJson = JSON.parse(reader.result);
		userInput.innerHTML = resultJson.data;
		fileNameLabel.innerHTML = fileName;
		// set content message and add animation:
		notification.style.backgroundColor = '#0b0';
		renderNotification('succeeded');
	};
	reader.onerror = function () {
		console.log(reader.error);
		// set content message and add animation:
		notification.style.backgroundColor = '#f00';
		renderNotification('failed');
	};
};

const handleBeforeUnload = (e) => {
	clearTimeout(notificationTimeout);
	const userInput = document.querySelector('.textArea').innerHTML;
	// show popup if user has had some changes:
	if (userInput) {
		e.returnValue = '';
	}
};

const handleClickButton = (clickedElement, typeAction) => {
	format(typeAction);
	clickedElement.classList.toggle('activeBtn');
};

saveButton.addEventListener('click', handleSaveFile);
boldButton.addEventListener('click', () => handleClickButton(boldButton, 'bold'));
italicButton.addEventListener('click', () => handleClickButton(italicButton, 'italic'));
bulletButton.addEventListener('click', () => handleClickButton(bulletButton, 'insertunorderedlist'));
fileInput.addEventListener('change', (e) => handleUploadFile(e));

// show popup before leave website:
window.addEventListener('beforeunload', handleBeforeUnload);
