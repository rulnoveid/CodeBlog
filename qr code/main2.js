const clearUrl = url => url.replace(/^data:image\/\w+;base64,/, '');

const downloadImage = (name, content, type) => {
  var link = document.createElement('a');
  link.style = 'position: fixed; left -10000px;';
  link.href = `data:application/octet-stream;base64,${encodeURIComponent(content)}`;
  link.download = /\.\w+/.test(name) ? name : `${name}.${type}`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

['png', 'jpg', 'gif'].forEach(type => {
  var download = document.querySelector(`#${type}`);
  download.addEventListener('click', function() {
    var img = document.querySelector('#qrcode-display img');

    downloadImage('myImage', clearUrl(img.src), type);
  });
});