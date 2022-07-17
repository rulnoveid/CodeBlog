var ipdetails;
var api = 'https://ipapi.co/json/';
var url = api;

function setup() {
  removeDummy();
  loadJSON(url, gotData);
  var button = select('#submit');
  button.mousePressed(refresh);
 
}

function refresh() {
  setTimeout(ipAsk,500);
  setTimeout(ipv4,500);

}

function ipAsk() {
  loadJSON(url, gotData);

}

function gotData(data) {
  ipdetails = data;
  if (ipdetails) {
	document.getElementById("auts").innerHTML = ipdetails.asn;
	document.getElementById("city").innerHTML = ipdetails.city;
	document.getElementById("coun").innerHTML = ipdetails.country_name + ' (' + ipdetails.country + ')';
	document.getElementById("ccc").innerHTML = ipdetails.country_calling_code;
	document.getElementById("curr").innerHTML = ipdetails.currency;
	document.getElementById("latlon").innerHTML = ipdetails.latitude + ', ' + ipdetails.longitude;
	document.getElementById("orga").innerHTML = ipdetails.org;
	document.getElementById("ipad").innerHTML = ipdetails.ip;
	document.getElementById("region").innerHTML = ipdetails.region + ' (' + ipdetails.region_code + ')';
	document.getElementById("timezone").innerHTML = ipdetails.timezone + ' (' + ipdetails.utc_offset + ')';
	document.getElementById("zipcode").innerHTML = ipdetails.postal;
  }
}

function removeDummy() {
	document.getElementById('defaultCanvas0').parentNode.removeChild(document.getElementById('defaultCanvas0'));
}


function tableToCSV(table, filename) {
  var data = [];
  var rows = document.querySelectorAll(`${table} tr`);
  for (var i = 0; i < rows.length; i++) {
    var row = [],
      cols = rows[i].querySelectorAll("td, th");
    for (var j = 0; j < cols.length; j++) {
      row.push(cols[j].innerText);
    }
    data.push(row.join(","));
  }
  downloadCSV(data.join("\n"), filename);
}

function downloadCSV(csv, filename) {
  var csv_file, download_link;
  csv_file = new Blob([csv], { type: "text/csv" });
  download_link = document.createElement("a");
  download_link.download = filename;
  download_link.href = window.URL.createObjectURL(csv_file);
  download_link.style.display = "none";
  document.body.appendChild(download_link);
  download_link.click();
}

function capitalizeAll(str) {
  try {
    let words = str.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return String(words).replace(/[,]/g, " ");
  } catch (err) {
    console.log(err);
  }
}
