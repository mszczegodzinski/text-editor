const textarea = document.querySelector('.textArea');
const saveButton = document.querySelector('.saveBtn');
const boldButton = document.querySelector('.boldBtn');
const italicButton = document.querySelector('.italicBtn');
const bulletButton = document.querySelector('.bulletBtn');
const fileInput = document.querySelector('.fileInput');
const notification = document.querySelector('.notification');
let notificationTimeout = null;

const format = (command, value) => {
	document.execCommand(command, false, value);
	textarea.focus();
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

const handleUploadFile = (input) => {
	const fileType = input.srcElement.files[0].type;
	if (fileType !== 'application/json') {
		return alert('Only json files are allowed. Try again with json file.');
	}
	const file = input.srcElement.files[0];
	const fileName = input.srcElement.files[0].name;
	const reader = new FileReader();

	reader.readAsText(file);
	reader.onload = function () {
		const userInput = document.querySelector('.textArea');
		const fileNameLabel = document.querySelector('.fileName');
		// parse txt content file to JSON:
		const resultJson = JSON.parse(reader.result);
		userInput.innerHTML = resultJson.data;
		fileNameLabel.innerHTML = fileName;
		// set content message and add animation:
		notification.textContent = 'File upload succeeded';
		notification.classList.add('showNotification');
		notificationTimeout = setTimeout(() => {
			notification.classList.remove('showNotification');
		}, 6000);
	};
	reader.onerror = function () {
		console.log(reader.error);
		// set content message and add animation:
		notification.style.backgroundColor = '#f00';
		notification.textContent = 'File upload failed';
		notification.classList.add('showNotification');
		notificationTimeout = setTimeout(() => {
			notification.classList.remove('showNotification');
		}, 6000);
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
