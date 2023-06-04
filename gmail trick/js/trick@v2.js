let counterLabel = document.getElementById("counter");
let count = 0;
let username = document.getElementById("username").value;

function* generate(email) {
	if (email.length <= 1) {
		yield email;
	} else {
		let head = email[0];
		let tail = email.slice(1);
		for (let item of generate(tail)) {
			yield head + item;
			yield head + '.' + item;
		}
	}
}

function updateEmails() {
	let username = document.getElementById("username").value;
	document.getElementById("emails").value = '';
	count = 0;
	let startTime = new Date();
	for (let message of generate(username)) {
		document.getElementById("emails").value += message + '@gmail.com\r\n';
		count += 1;
		counterLabel.innerText = 'Generated: ' + count;
	}
	document.getElementById("emails").value = document.getElementById("emails").value.slice(0, -1);
	let endTime = new Date();
	let timeDiff = endTime - startTime;
	console.log('Finished in ' + timeDiff + 'ms');
}
document.getElementById("username").oninput = function() {
	let newUsername = document.getElementById("username").value;
	if (username !== newUsername) {
		username = newUsername;
		if (username.length > 1) {
			setTimeout(updateEmails, 150);
		}
	}
};

const fileNameInput = document.getElementById('username'),
	selectMenu = document.getElementById("save-as"),
	saveBtn = document.getElementById("saveBtn");

selectMenu.addEventListener("change", () => {
	const selectedFormat = selectMenu.options[selectMenu.selectedIndex].text;
	saveBtn.innerText = `Save As ${selectedFormat.split(" ")[0]} File`;
});

saveBtn.addEventListener("click", () => {
	const blob = new Blob([document.getElementById('emails').value], {
		type: selectMenu.value
	});
	const fileUrl = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.download = fileNameInput.value;
	link.href = fileUrl;
	link.click();
});