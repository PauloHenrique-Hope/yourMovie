import {useEffect, useState} from 'react'
import './App.css';

import popCorn from './assets/popCorn.png'



const KEY = "684daf52";


function App() {

  const [query, setQuery] = useState("interstellar")
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedId, setSelectedId] = useState(null)

  function handleSelectedId(id){
    setSelectedId((selectedId) => id === selectedId? null : id)
    console.log(selectedId)
  }

  useEffect(function (){
    async function fetchMovies(){

      try{
        setIsLoading(true)
        setError("")
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`)

        if(!res.ok) throw new Error("Error while fetching movies.")

        const data = await res.json()
        if(data.Response === "False") throw new Error("Movie not found")
        setMovies(data.Search)
        
        console.log(data)
      }catch(err){
        setError(err.message)
        console.error(err.message)
      }finally{
        setIsLoading(false)
      }
    }

    if(query.length < 3){
      setMovies([])
      setError("")
      return;
    }
    fetchMovies();


  }, [query])

  return (
    <div className="App">
      <NavBar query={query} setQuery={setQuery}/>
      <Box>
          {!isLoading && !error && <MoviesList movies={movies} onSelectedId={handleSelectedId}/>}
          {isLoading && !error && <Loader/>}
          {!isLoading && error && <ErrorMessage message={error}/>}
          {selectedId? <MovieDetails selectedId={selectedId}/> : <WatchedList/>}
          
          
      </Box>
    </div>
  );
}

function Loader(){
  return(
    <div className='loader'>
      <span>Loading...</span>
    </div>
  )
}

function ErrorMessage({message}){
  return(
    <div className='loader'>
      {message}
    </div>
  )
}

function NavBar({query, setQuery}){
  return(
    <div className="navBar">
      <div className="logo">
        <img className="logoIcon" src={popCorn} alt="popCorn" />
        <h1>YourMovie</h1>
      </div>
      <div className="searchBar" >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="searchIcon">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>

        <input type="text" placeholder='Search movies...' value={query} onChange={(e) => setQuery(e.target.value)}/>
      </div>
    </div>
  )
}

function Box({children}){
  return(
    <div className="box">
      {children}
    </div>
  )
}

function MoviesList({movies, onSelectedId}){
  return(
    <div className="moviesList">
      {movies.map(movie => (
        <Card movie = {movie} key={movie.imdbID} onSelectedId={onSelectedId}/>
      ))}
    </div>
  )
}

function Card({movie, onSelectedId}){
  return(
    <div className='card' role='button' onClick={() => onSelectedId(movie.imdbID)}>
      <img src={movie.Poster} alt={movie.Title} />
      <div className='infoCard'>
        <p className='title'>🎞 {movie.Title}</p>
        <p className='year'>📅 {movie.Year}</p>
      </div>
    </div>
  )
}

function WatchedList(){
  return(
    <div className="watchedList">
      <Details/>
    </div>
  )
}

function Details(){
  return(
    <div className='details'>
      <h3>Watched List</h3>
      <div className='status'>
        <span className='movies'>🎬0 movies</span>
        <span className='time'>⌛ time</span>
        <span className='rate'>✨ rate</span>
      </div>
    </div>
  )
}

function MovieDetails({selectedId}){

  const [selectedMovie, setSelectedMovie] = useState({})

  const {
    Title: title,
  } = selectedMovie;


  useEffect(function (){
    async function getSelectedMovie(){
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`)

      const data = await res.json()

      setSelectedMovie(data)
      console.log(data)
    }

    getSelectedMovie()
  }, [selectedId])

  useEffect(function(){
    if(!title) return;
    document.title = `Movie | ${title}`

    return function(){
      document.title = "yourMovie"
    }

  }, [title])

  return(
    <div className='movieDetails'>
      <img src={selectedMovie.Poster} alt={selectedMovie.Title} />
      <div className='movieInfo'>
        <p className='selectedTitle'>✨{selectedMovie.Title}</p>
        <p className='genre'>{selectedMovie.Genre}</p>
        <p className='released'>{selectedMovie.Released}</p>
      </div>
      
      <p className='plot'>🎬 {selectedMovie.Plot}</p>
    </div>
  )
}

export default App;
