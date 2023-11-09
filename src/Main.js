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
  handleDeleteFilm,
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
            <WatchedFilms watched={watched} onClickDelete={handleDeleteFilm} />
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

function WatchedFilms({ watched, onClickDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedFilm
          movie={movie}
          key={movie.imdbID}
          onClickDelete={onClickDelete}
        />
      ))}
    </ul>
  );
}
function WatchedFilm({ movie, onClickDelete }) {
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
        <button className="deleteButton" onClick={() => onClickDelete(movie)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="red"
            class="bi bi-x-circle-fill"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
          </svg>
        </button>
      </div>
    </li>
  );
}
