  fetch('https://api.myquran.com/v1/sholat/jadwal/' + cityID + '/' + year + '/' + month + '/' + day + '')
    .then(response => response.json())
    .then((result) => {

      const data = result.data;
      const jadwal = data.jadwal;

      const loc = document.querySelector('.loc').innerText = 'Wilayah ' + data.lokasi + '';
      const dates = elmdate.innerText = '' + dateText + '';
      const innerSubuh = subuh.innerText = '' + jadwal.subuh + '';
      const innerDhuha = dhuha.innerText = '' + jadwal.dhuha + '';
      const innerDzuhur = dzuhur.innerText = '' + jadwal.dzuhur + '';
      const innerAshar = ashar.innerText = '' + jadwal.ashar + '';
      const innerMaghrib = maghrib.innerText = '' + jadwal.maghrib + '';
      const innerIsya = isya.innerText = '' + jadwal.isya + '';

      const timecreate = document.createElement("div");
      timecreate.classList.add("times");
      elmdate.appendChild(timecreate);

      const customClock = () => {
        var dt = new Date();
        var hrs = dt.getHours();
        var min = dt.getMinutes();
        var sec = dt.getSeconds();

        var elm = document.querySelector('.times');
        var TimeStr = hrs + ":" + min + ":" + sec;
        elm.innerHTML = TimeStr;
      }
      setInterval(customClock, 500);

    })
    .catch((e) => console.log(e));