import React, { useEffect, useRef, useState } from 'react'
import StarRating from './StarRating';
import { Loader } from './Loader';
import {useKey} from '../utils/useKey'

export  const MovieDetails = ({onClose,selectedMovieId,handleAddWatched,watchedMovies}) => {
    const APIKEY = '3459bda0'

    const countRef = useRef(0);

    const [movie, setMovie] = useState({})
    const [loader, setloader] = useState(false)
    const [userRating, setuserRating] = useState('')

    const isWatched = watchedMovies.map(movie=>movie.imdbID).includes(selectedMovieId)
    const watchedRating = watchedMovies.find((movie) => movie.imdbID === selectedMovieId)?.userRating;

    useEffect(() => {
      if(userRating) countRef.current = countRef.current + 1
    }, [userRating])
    

    useEffect(() => {
      const getMovieDetails = async () => {
          try {
              setloader(true)
              const res = await fetch(`https://www.omdbapi.com/?apikey=${APIKEY}&i=${selectedMovieId}`);
              const data = await res.json();
              setMovie(data)
              setloader(false)
          } catch (error) {
              console.error("Error fetching movie data:", error);
          }
      };
      getMovieDetails()
  }, [selectedMovieId]);

  useEffect(() => {
    if(!movie.Title) return;
    document.title = `Movie | ${movie.Title}`

    return () => {
        document.title = 'usePopcorn'
    }
  }, [movie.Title])
  
  useKey('Escape',onClose)

  const handleAdd = (movie) => {
    const newWatchedMovie = {
        title : movie.Title,
        year :movie.Year,
        imdbID : selectedMovieId,
        poster : movie.Poster,
        imdbRating : Number(movie.imdbRating),
        runtime : Number(movie.Runtime.split(' ').at(0)),
        userRating : userRating,
        countRatingDecision : countRef.current
    }
    handleAddWatched(newWatchedMovie)
    onClose()
  }
    
    return (
    <div className="details">
        {loader ? <Loader /> :
        <>
        <header>
            <button className="btn-back" onClick={() => {onClose()}}>&larr;</button>
            <img src={movie.Poster} alt='poster'></img>
            <div className='details-overview'>
                <h2>{movie.Title}</h2>
                <p>{movie.Released} &bull; {movie.Runtime}</p>
                <p>{movie.Genre}</p>
                <p><span>⭐️⭐️⭐️</span>{movie.imdbRating} Imdb Rating</p>
            </div>
        </header>
        <section>
            <div className='rating'>
                {!isWatched ? 
                <>
                    <StarRating maxRating={10} size={24} onSetRating={setuserRating} />
                    {userRating > 0 && <button className='btn-add' onClick={() => handleAdd(movie)}>+ Add to the list</button>}
                </>
                : <p>You rated this movie {watchedRating} ⭐️</p>}
            </div>
            <p><em>{movie.Plot}</em></p>
            <p>Starring {movie.Actors}</p>
            <p>Directed By {movie.Director}</p>
        </section>
        </>}
    </div>
    )
  }
