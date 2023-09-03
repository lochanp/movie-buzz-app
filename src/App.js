import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import MainContent from "./components/MainContent";
import SearchField from "./components/navbar/SearchField";
import NumResults from "./components/navbar/NumResults";
import ListBox from "./components/ListBox";
import WatchedBox from "./components/WatchedBox";
import MovieList from "./components/MovieList";
import { Loader } from "./components/Loader";
import { MovieDetails } from "./components/MovieDetails";
import { useLocalStorage } from "./utils/useLocalStorage";

const APIKEY = '3459bda0'

export default function App() {
  const [movies, setMovies] = useState([])
  const [watchedMovies, setwatchedMovies] = useLocalStorage([],'watched')
  const [isLoading, setisLoading] = useState(false)
  const [error, seterror] = useState('')
  const [query, setQuery] = useState("");
  const [selectedMovieId, setselectedMovieId] = useState(null)
// 
  // const controller = new AbortController()
  const controller = useMemo(() => new AbortController(),[])

  const empty = query.length <= 0

  const handleSelectMovie = (id) => {
    setselectedMovieId(selectedMovieId => id === selectedMovieId ? null : id)
  }

  const handleCloseMovie = () => {
    setselectedMovieId(null)
  }

  const handleAddWatched = (movie) => {
    setwatchedMovies(watched => [...watched,movie])
  }

  const handleDeleteWatched = (id) => {
    setwatchedMovies(watched => watched.filter(movie => movie.imdbID !== id))
  }  

  useEffect(() => {
    /** data fetching with Promise **/
    // fetch(`http://www.omdbapi.com/?apikey=${APIKEY}&s=${query}`).then(res=>res.json()).then(data =>setMovies(data.Search))
    /* Data fetchingwith async await */
    const fetchMovies = async () => {
      try{
        setisLoading(true)
        seterror('')
        const res = await fetch(`http://www.omdbapi.com/?apikey=${APIKEY}&s=movie`)
        if(!res.ok) throw new Error('something went wrong!')
        const data = await res.json()
        if(data.Response === 'False') {
          throw new Error('Movie not found!')
        }
        else {
          setMovies(data.Search)
          seterror('')
        }
      } 
      catch(err) {
        if(err.name !== 'AbortError'){
          seterror(err.message)
        }
      }
      finally {
        setisLoading(false)
      }
    }
    fetchMovies()

  }, [empty])

  useEffect(() => {
    /** data fetching with Promise **/
    // fetch(`http://www.omdbapi.com/?apikey=${APIKEY}&s=${query}`).then(res=>res.json()).then(data =>setMovies(data.Search))
    /* Data fetchingwith async await */
    const fetchMovies = async () => {
      try{
        setisLoading(true)
        seterror('')
        const res = await fetch(`http://www.omdbapi.com/?apikey=${APIKEY}&s=${query}`,{signal:controller.signal})
        if(!res.ok) throw new Error('something went wrong!')
        const data = await res.json()
        if(data.Response === 'False') {
          throw new Error('Movie not found!')
        }
        else {
          setMovies(data.Search)
          seterror('')
        }
      } 
      catch(err) {
        if(err.name !== 'AbortError'){
          seterror(err.message)
        }
      }
      finally {
        setisLoading(false)
      }
    } 
    if(query.length < 3) {
      setMovies([])
      seterror('');
      return;
    }
    handleCloseMovie()
    fetchMovies()

    return () => controller.abort()
  }, [query,controller])


  return (
    <>
      <Navbar>
        <SearchField query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <MainContent>
        <ListBox>
         {isLoading && <Loader />}
         {!isLoading && !error && <MovieList movies={movies} onClick={handleSelectMovie} />}
         {error && <p className="error">🚫{error}</p>}
        </ListBox>
        <ListBox>
        {selectedMovieId ? 
          <MovieDetails 
            watchedMovies={watchedMovies}
            handleAddWatched={handleAddWatched} 
            selectedMovieId={selectedMovieId} 
            onClose={handleCloseMovie} 
          /> 
          : <WatchedBox handleDeleteWatched={handleDeleteWatched} watched={watchedMovies} />}
        </ListBox>
      </MainContent>
    </>
  );
}
