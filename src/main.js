const textarea = document.querySelector('.textArea');
const saveButton = document.querySelector('.saveBtn');
const boldButton = document.querySelector('.boldBtn');
const italicButton = document.querySelector('.italicBtn');
const bulletButton = document.querySelector('.bulletBtn');
const fileInput = document.querySelector('.fileInput');

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
		const resultJson = JSON.parse(reader.result);
		const userInput = document.querySelector('.textArea');
		const fileNameLabel = document.querySelector('.fileName');
		userInput.innerHTML = resultJson.data;
		fileNameLabel.innerHTML = fileName;
		alert('File upload succeeded');
	};
	reader.onerror = function () {
		console.log(reader.error);
		alert('File upload failed. Try again');
	};
};

const handleBeforeUnload = (e) => {
	const userInput = document.querySelector('.textArea').innerHTML;
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

// show popup if user has had some changes:
window.addEventListener('beforeunload', handleBeforeUnload);
