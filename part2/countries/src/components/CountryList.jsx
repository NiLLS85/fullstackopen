const CountryList = ({ countries, onShow }) => (
  <ul className="countries">
    {countries.map(country => (
      <li key={country.cca3}>
        {country.name.common} <button onClick={() => onShow(country.cca3)}>show</button>
      </li>
    ))}
  </ul>
)

export default CountryList
