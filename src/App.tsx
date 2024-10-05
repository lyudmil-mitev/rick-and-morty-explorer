import mortyLogo from '/android-chrome-512x512.png'
import './App.css'

function App() {
  return (
    <>
      <div>
        <a href="https://rickandmortyapi.com/" target="_blank">
          <img src={mortyLogo} className="logo" alt="Morty Logo" />
        </a>
      </div>
      <main>
        <h1>Rick and Morty</h1>
        <div>
          <p>
            Rick and Morty 1000 years Rick and Morty forever and forever a hundred times Rick and Morty dot com Rick and morty 20 seasons!
            Rick and morty forever and forever a hundred years Rick and Morty shtick and Morty some things Rick and Morty runnin' around Rick and Morty time all day all a hundred years Rick and Morty forever a hundred times Rick and Morty over and over Rick and Morty adventures dot com two things Rick and Morty Rick and Morty dot com two things Rick and Morty adventures Rick and Morty dot com
          </p>
        </div>
      </main>
    </>
  )
}

export default App
