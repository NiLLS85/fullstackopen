import Weather from './Weather'

const Country = ({ country }) => {
  const capital = country.capital?.[0]
  const languages = Object.values(country.languages ?? {})
  const coordinates = country.capitalInfo?.latlng ?? country.latlng

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {capital ?? '-'}</p>
      <p>area {country.area}</p>

      <h2>Languages</h2>
      <ul>
        {languages.map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img
        className="flag"
        src={country.flags.png}
        alt={country.flags.alt ?? `flag of ${country.name.common}`}
      />

      {capital && coordinates && <Weather city={capital} latlng={coordinates} />}
    </div>
  )
}

export default Country
