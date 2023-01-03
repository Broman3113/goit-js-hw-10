const BASE_URL = "https://restcountries.com/v3.1/name/";
const FIELDS = ['name', 'capital', 'population', 'flags', 'languages'];

export function fetchCountries(searchQuery) {
    return fetch(`${BASE_URL}${searchQuery}/?fields=${FIELDS.join(',')}`)
        .then(response => {
            if (response.status === 404) throw new Error('Oops, there is no country with that name')
            return response.json()
        })
}