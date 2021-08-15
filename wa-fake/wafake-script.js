/* Meme */


/* Time */

var deviceTime = document.querySelector('.status-bar .time');
var messageTime = document.querySelectorAll('.message .time');

deviceTime.innerHTML = moment().format('h:mm');



for (var i = 0; i < messageTime.length; i++) {
	messageTime[i].innerHTML = moment().format('h:mm A');
}

/* Message */

var form = document.querySelector('.conversation-compose');
var conversation = document.querySelector('.conversation-container');

form.addEventListener('submit', newMessage);

function newMessage(e) {
	var input = e.target.input;

	if (input.value) {
		var message = buildMessage(input.value);
		conversation.appendChild(message);
		animateMessage(message);
	}

	input.value = '';
	conversation.scrollTop = conversation.scrollHeight;

	e.preventDefault();
}

function buildMessage(text) {
	var element = document.createElement('div');
	var checkedValue = document.querySelector('.messageCheckbox:checked').value;

	if(checkedValue == 'user'){
		var msg_type = 'sent';
		var tick = 	'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#4fc3f7"/></svg>';
		
	}else{
		var msg_type = 'received';
		var tick = "";
	}

	element.classList.add('message', msg_type);
	var time = document.getElementById('input').value;
	if (time == "") {
		time = moment().format('h:mm A');
	}else{
		
		var str = time;
		var array = str.split(" ");
		deviceTime.innerHTML = array[0];
	
	}
	
	
	
	
	element.innerHTML = text +
		'<span class="metadata">' +
			'<span class="time">' + time + '</span>' +
			'<span class="tick tick-animation">' + tick +
			'</span>' +
		'</span>';

	return element;
}

function animateMessage(message) {
	setTimeout(function() {
		var tick = message.querySelector('.tick');
		tick.classList.remove('tick-animation');
	}, 500);
}






//SWITCH
$('.switch label').on('click', function(){
  var indicator = $(this).parent('.switch').find('span');
  if ( $(this).hasClass('right') ){
		$(indicator).addClass('right');
  } else {
    $(indicator).removeClass('right');
  }
});



//Name 
var username = document.getElementById('name');

username.onkeyup = function(){
    document.getElementById('nameprint').innerHTML = username.value;
}

//upload image
     function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#blah')
                        .attr('src', e.target.result);
                };

                reader.readAsDataURL(input.files[0]);
            }
        };
 readURL('whatbg.png');

//time picker
// TODO: add mousewheel support to clock face

// TODO: add mousewheel support to clock face
