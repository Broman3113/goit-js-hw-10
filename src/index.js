import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  search: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.search.addEventListener('input', debounce(onSearchChange, DEBOUNCE_DELAY));

function onSearchChange(e) {
  const searchQuery = e.target.value.trim();
  if (searchQuery) {
    fetchCountries(searchQuery)
      .then(checkCountryLength)
      .catch(error => {
        Notify.failure(error.message);
        resetOutputMarkups();
      });
  } else { 
    resetOutputMarkups();
  }
}

function checkCountryLength(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.length > 2 && countries.length <= 10) {
    const countryListMarkup = makeCountryListMakrup(countries);
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = countryListMarkup;
  } else if (countries.length === 1) {
    const countryInfoMakrup = makeCountryInfoMarkup(countries[0]);
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = countryInfoMakrup;
  }
}

function makeCountryListMakrup(countries) {
  return countries
    .map(
      country => `
        <li class="country-list__item">
            <img class="country-list__icon" src=${country.flags.svg} alt=${country.name.official} />
            <span class="country-list__title">${country.name.official}</span>
        </li>
    `
    )
    .join(' ');
}

function makeCountryInfoMarkup(country) {
  return `
        <div>
            <img class="country-list__icon" src=${country.flags.svg} alt=${
    country.name.official
  } />
            <span class="country-list__title">${country.name.official}</span>
        </div>
        <p>Capital: ${country.capital}</p>
        <p>Population: ${country.population}</p>
        <p>Languages: ${Object.values(country.languages).join(', ')}</p>
    `;
}

function resetOutputMarkups() {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
}