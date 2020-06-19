const URL = "https://api.openweathermap.org/data/2.5/";
const search = document.querySelector(".search__location");
moment.locale("id");
const API_TOKEN = "65a9d1dbf4371e47a6082beb1eb61f46";
localStorage.setItem("q", "banyuwangi,id");
const QUERY = localStorage.getItem("q");

// WEATHER_API = `${URL}weather?lat=${coord.latitude}&lon=${coord.longitude}&appid=${API_TOKEN}&units=metric`;
// FORECAST_API = `${URL}forecast?lat=${coord.latitude}&lon=${coord.longitude}&cnt=3&appid=${API_TOKEN}&units=metric`;

const btn = document.querySelector(".search__button");
const temp = document.querySelector(".card__temperature");
const desc = document.querySelector(".card__description");
const pressure = document.querySelector(".meta-data__pressure-value");
const airspeed = document.querySelector(".meta-data__wind-value");
const sunset = document.querySelector(".meta-data__sunset-value");
const sunrise = document.querySelector(".meta-data__sunrise-value");
const humidity = document.querySelector(".meta-data__humidity-value");
const geo = document.querySelector(".meta-data__geo-value");
const fetcher = (url) => fetch(url).then((data) => data.json());

(() => {
  const getData = async (q) => {
    WEATHER_API = `${URL}weather?q=${q}&appid=${API_TOKEN}&units=metric`;
    FORECAST_API = `${URL}forecast?q=${q}&cnt=3&appid=${API_TOKEN}&units=metric`;
    const res = Promise.all([fetcher(WEATHER_API), fetcher(FORECAST_API)]);
    return await res;
    // FIXME: error scoping weather nilai string kosong, tidak dapat diubah dari navigotor
  };

  const initializeELement = (q) => {
    getData(q)
      .then((blob) => {
        console.log(blob);
        const [weather, forecast] = blob;
        initWheather(weather);
        initForecast(forecast);
        const loading = document.querySelector(".loading");
        if (loading) loading.remove();
      })
      .catch((error) => console.log(error));
  };

  function initWheather({ main, coord, name, weather, wind, sys }) {
    temp.textContent = `${main.temp}°`;
    desc.textContent = `${weather[0].description}`;
    search.value = `${name}, ${sys.country}`;
    localStorage.setItem("q", `${name}, ${sys.country}`.replace(/\s/g, ""));
    airspeed.textContent = `${wind.speed} m/s`;
    pressure.textContent = `${main.pressure} hpa`;
    humidity.textContent = `${main.humidity} %`;
    sunset.textContent = `${moment.unix(sys.sunset).format("LT")}`;
    sunrise.textContent = `${moment.unix(sys.sunrise).format("LT")}`;
    geo.textContent = `${coord.lat}, ${coord.lon}`;
    document.title = `Cuaca di ${name}, ${sys.country}`;
  }

  function initForecast({ list, cnt }) {
    console.log(list[0]);
    const forecast_item = document.querySelectorAll(".forecast");
    forecast_item.forEach((i) => i.remove());
    const data_count = document.querySelector(".content__title");
    data_count.textContent = `${cnt} day weather forecast`;
    const el = list
      .map((item) => {
        return `
        <article class="forecast">
          <div class="forecast__icon">
            <img width="60px" height="60px" src="https://openweathermap.org/img/wn/${
              item.weather[0].icon
            }@2x.png" alt="icon">
          </div>
          <div class="forecast__temperature">
            <h2 class="forecast__temperature-average">${item.main.temp}°</h2>
            <span class="forecast__temperature-min">MIN ${
              item.main.temp_min
            }°</span>
            <span class="forecast__temperature-max">MAX ${
              item.main.temp_max
            }°</span>
          </div>
          <div class="forecast__event">
            <div class="forecast__event-date">${moment
              .unix(item.dt)
              .format("ddd D MMM")}</div>
            <div class="forecast__event-time">${moment
              .unix(item.dt)
              .format("LT")}</div>
          </div>
          <div class="forecast__description">
            <div class="forecast__description-main">${
              item.weather[0].main
            }</div>
            <div class="forecast__description-detail">${
              item.weather[0].description
            }</div>
          </div>
        </article>
      `;
      })
      .join("");
    data_count.insertAdjacentHTML("afterend", el);
  }

  initializeELement(QUERY);

  setInterval(() => {
    initializeELement(QUERY);
  }, 100000);

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.setItem("q", search.value.replace(/\s/g, ""));
    initializeELement(search.value);
  });
})();
