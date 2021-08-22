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