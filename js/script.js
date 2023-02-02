const input = document.querySelector('.header input');
const searchBtn = document.getElementById('search-btn');
const loader = document.getElementById('loader');
const countryFlagsCollection = Array.from(document.querySelectorAll('.country-flag'));
const countryNamesCollection = Array.from(document.querySelectorAll('.country-info > strong'));
const countryPercentageCollection = Array.from(document.querySelectorAll('.country-info span'));

const request = () => {
  loader.style.display = 'block';
  for (let i=0;i<5;i++) {
    countryPercentageCollection[i].textContent = '';
    countryFlagsCollection[i].style.backgroundImage = '';
    countryNamesCollection[i].textContent = '';
  }
  fetchData(input.value);
}

input.addEventListener('keydown', e => {
  if (e.keyCode == 13) request()
});

searchBtn.addEventListener('click', request)

const fetchData = async name => {
  const url = `https://api.nationalize.io/?name=${name}`
  try {
    let responseIDs = await (await fetch(url)).json();    let IDs = responseIDs.country.map(obj => obj.country_id.toLowerCase())
    renderFlags(IDs)
    let countryNames = IDs.map(id => getCountryNameById(id))
    renderName(countryNames)
    let percentages = responseIDs.country.map(obj => Math.round(obj.probability*100));
    renderPercentage(percentages);
    if (responseIDs.country.length != 0) loader.style.display = 'none';
  } catch (error) {
    console.error(error)
  }
}

import { countryNames } from "../countryNames.js";

const getCountryNameById = id => {
  id = id.toUpperCase()
  return countryNames[`${id}`]
}

const renderFlags = (ids) => {
  for (let i in countryFlagsCollection) {
    for (let i in ids) {
      let url = `https://flagcdn.com/w320/${ids[i]}.png`;
      countryFlagsCollection[i].style.backgroundImage = `url(${url})`;
    }
  }
}
const renderName = (names) => {
  for (let i in countryNamesCollection) {
    countryNamesCollection[i].textContent = names[i];
  }
}
const renderPercentage = (percentages) => {
  for (let i in countryPercentageCollection) {
      countryPercentageCollection[i].textContent = `${percentages[i]}%`;
      if (countryPercentageCollection[i].textContent == 'undefined%') {
        countryPercentageCollection[i].textContent = '';
        countryFlagsCollection[i].style.backgroundImage = '';
        countryNamesCollection[i].textContent = '';
      }
  }
}