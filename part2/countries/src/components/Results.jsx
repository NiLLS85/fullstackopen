import Country from './Country'
import CountryList from './CountryList'

const Results = ({ query, matches, onShow }) => {
  if (query.trim() === '') {
    return null
  }

  if (matches.length === 0) {
    return <p>No matches</p>
  }

  if (matches.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (matches.length === 1) {
    return <Country country={matches[0]} />
  }

  return <CountryList countries={matches} onShow={onShow} />
}

export default Results
