function addMultipleEventListener(element, eventNames, listener) {
  try {
    let events = eventNames.split(" ");
    for (let i = 0, iLen = events.length; i < iLen; i++) {
      element.addEventListener(events[i], listener, false);
    }
  } catch (err) {
    console.log(err);
  }
}

addMultipleEventListener(window, "load resize", function () {
  try {
    let scrollWidth =
      document.querySelector(".tbl-content").offsetWidth -
      document.querySelector(".tbl-content").querySelector("table").offsetWidth;
    document.querySelector(
      ".tbl-header"
    ).style.paddingRight = `${scrollWidth}px`;
  } catch (err) {
    console.log(err);
  }
});

document.addEventListener("DOMContentLoaded", function (event) {
  try {
    document.querySelector(".preloader").style.display = "grid";
    setIpGeoData();
  } catch (err) {
    console.log(err);
  }
});

function JSONP(url, callback) {
  try {
    let id = ("jsonp" + Math.random() * new Date()).replace(".", "");
    let script = document.createElement("script");
    script.src = url.replace("callback=?", "callback=" + id);
    document.body.appendChild(script);
    window[id] = function (data) {
      if (callback) {
        callback(data);
      }
    };
  } catch (err) {
    console.log(err);
  }
}

async function getIpAddress() {
  try {
    let ipResponse = await fetch("https://api.ipify.org/?format=json", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let ipData = await ipResponse.json();
    return ipData.ip;
  } catch (err) {
    console.log(err);
  }
}

async function getGeoIpDetails() {
  try {
    let geoipResponse = await fetch("https://ipapi.co/json/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let geoipData = await geoipResponse.json();
    let ipAddress = await getIpAddress();
    if (ipAddress) {
      geoipData.ip = ipAddress;
    }
    return geoipData;
  } catch (err) {
    console.log(err);
  }
}

function setIpGeoData() {
  try {
    getGeoIpDetails().then((res) => {
      createGeoIpTable(res);
    });
    // JSONP("https://freegeoip.app/json/?callback=?", async function (res) {
    //   res.ip = await getIpAddress();
    //   createGeoIpTable(res);
    // });
  } catch (err) {
    console.log(err);
  }
}

function createGeoIpTable(data) {
  try {
    let ignoredKeys = [
      "version",
      "region_code",
      "country_code",
      "country_code_iso3",
      "country",
      "continent_code",
      "in_eu",
      "currency_name",
      "languages",
    ];
    document.querySelector("#geoipTbody").innerHTML = "";
    for (let [key, value] of Object.entries(data)) {
      if (ignoredKeys.indexOf(key) < 0) {
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        td1.innerHTML = capitalizeAll(key.replace(/[_]/g, " "));
        td2.innerHTML = value;
        tr.appendChild(td1);
        tr.appendChild(td2);
        document.querySelector("#geoipTbody").appendChild(tr);
      }
    }
    document.querySelector(".preloader").style.display = "none";
    document.querySelector("#geoipSection").style.display = "block";
  } catch (err) {
    console.log(err);
  }
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
