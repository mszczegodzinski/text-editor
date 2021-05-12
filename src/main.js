const textarea = document.querySelector('.textArea');
const saveButton = document.querySelector('.saveBtn');
const boldButton = document.querySelector('.boldBtn');
const italicButton = document.querySelector('.italicBtn');
const bulletButton = document.querySelector('.bulletBtn');
const buttons = document.querySelectorAll('a');

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
	// console.log(resultJson);
	download(resultJson, 'data.json', 'application/json');
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

// show popup if user has had some changes:
window.addEventListener('beforeunload', handleBeforeUnload);
