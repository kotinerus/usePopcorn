import { Box } from "./Box";

import { MovieList } from "./MovieList";

import { Summary } from "./Summary";

import { useEffect, useState } from "react";
import StarRating from "./StarRating";

export function Main({
  movies,
  isLoading,
  message,
  selectedId,
  handleFilmClick,
  handleClose,
  API_KEY,
  onAddWatched,
  watched,
}) {
  return (
    <main className="main">
      <Box>
        {isLoading && <Loading />}
        {!isLoading && !message && (
          <MovieList movies={movies} handleFilmClick={handleFilmClick} />
        )}
        {message && <ErrorMessage message={message} />}
      </Box>
      <Box>
        {selectedId ? (
          <MovieDetails
            selectedId={selectedId}
            handleClose={handleClose}
            API_KEY={API_KEY}
            onAddWatched={onAddWatched}
          />
        ) : (
          <>
            <Summary watched={watched} />
            <WatchedFilms watched={watched} />
          </>
        )}
      </Box>
    </main>
  );
}
function Loading() {
  return <p className="loader">LOADING...</p>;
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}

function MovieDetails({ selectedId, handleClose, API_KEY, onAddWatched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [movie]
  );

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: runtime.split(" ").at(0),
      userRating: userRating,
    };
    onAddWatched(newWatchedMovie);
    handleClose();
  }

  useEffect(
    function () {
      setIsLoading(true);
      async function getMoviesDetails() {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMoviesDetails();
    },
    [selectedId]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleClose}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of the ${movie}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released}&bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating}IMDb rating
              </p>
            </div>
          </header>

          <section>
            <StarRating maxStars={10} size={32} onSetRating={setUserRating} />
            {userRating && (
              <button className="btn-add" onClick={handleAdd}>
                + Add to list
              </button>
            )}
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedFilms({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedFilm movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}
function WatchedFilm({ movie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.Title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}
