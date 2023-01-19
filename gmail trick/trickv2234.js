var username, provider, emails = "";

function start() {
    username = document.getElementById("username").value;
    provider = document.getElementById("provider").value;

    //Validation
    if (username == "" || provider == "") {
        alert("Username and Email Provider are mandatory.");
    }
    else {
		document.getElementById("emailContainer").style.display = "none";
		document.getElementById("viewResult").style.display = "none";
        document.getElementById("loader").style.display = "block";
		document.getElementById("emails").value = "";

        //Do the work
        setTimeout(function() {
            getDotEmail(username, 1);

            document.getElementById("emails").value = emails;

            //Clear variable
            emails = "";

            document.getElementById("loader").style.display = "none";
            
			if(username.length <= 18)
				document.getElementById("emailContainer").style.display = "block";
			else
				document.getElementById("viewResult").style.display = "block";
        }, 20);
    }
}

function showEmailContainer() {
	document.getElementById("viewResult").style.display = "none";
	document.getElementById("loader").style.display = "block";
	setTimeout(function() {
		document.getElementById("emailContainer").style.display = "block";
		document.getElementById("loader").style.display = "none";
	}, 20);
}

function getDotEmail(email, position) {
    if (email.length != position) {
        getDotEmail(email, position + 1);
        getDotEmail(email.substr(0, position) + '.' + email.substr(position), position + 2);
    }
    else
        emails += email + "@" + provider + '\n';
}

function copy() {
    document.getElementById("emails").select();
    document.execCommand('copy');
}

function save() {
    blob = new Blob([document.getElementById('emails').value.replace(/\n/g, "\r\n")], { type: "text/plain;charset=utf-8", endings: "transparent" });
    FileSaver.saveAs(blob, document.getElementById('username').value + ".txt");
}

function giveSuggestion() {
    var length = document.getElementById("username").value.length;

    if (length > 0)
        document.getElementById("suggestion").innerText = "Will generate " + Math.pow(2, length - 1) + " email(s).";
    else
        document.getElementById("suggestion").innerText = "";
}
