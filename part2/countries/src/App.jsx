import { useEffect, useState } from 'react'

import Country from './components/Country'
import Results from './components/Results'
import countryService from './services/countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    countryService
      .getAll()
      .then(data => setCountries(data))
      .catch(() => setLoadError(true))
  }, [])

  const handleQueryChange = event => {
    setQuery(event.target.value)
    setSelected(null)
  }

  const search = query.trim().toLowerCase()
  const matches = countries.filter(country =>
    country.name.common.toLowerCase().includes(search)
  )
  // Si el nombre coincide exactamente (p. ej. "sudan"), se muestra ese país.
  const exact = matches.find(country => country.name.common.toLowerCase() === search)
  const selectedCountry = countries.find(country => country.cca3 === selected)

  return (
    <div>
      <div>
        find countries <input value={query} onChange={handleQueryChange} />
      </div>
      {loadError && <p>Could not load the list of countries.</p>}
      {selectedCountry ? (
        <Country country={selectedCountry} />
      ) : (
        <Results query={query} matches={exact ? [exact] : matches} onShow={setSelected} />
      )}
    </div>
  )
}

export default App
