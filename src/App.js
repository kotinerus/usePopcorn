import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { Main } from "./Main";

import "./index.css";

const API_KEY = "aeb1400f";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useState([]);

  function handleFilmClick(id) {
    setSelectedId(id);
  }
  function handleClose() {
    setSelectedId(null);
  }
  function handleAddWatched(movie) {
    console.log("test");
    const isNotInList = !(
      watched.filter((e) => e.imdbID === movie.imdbID).length > 0
    );
    console.log(isNotInList);
    isNotInList && setWatched((watched) => [...watched, movie]);
  }
  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
          );
          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
        } catch (err) {
          console.log(err.message);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();
    },
    [query]
  );

  return (
    <>
      <Navbar movies={movies} query={query} setQuery={setQuery} />
      <Main
        movies={movies}
        isLoading={isLoading}
        message={error}
        selectedId={selectedId}
        handleFilmClick={handleFilmClick}
        handleClose={handleClose}
        API_KEY={API_KEY}
        onAddWatched={handleAddWatched}
        watched={watched}
      />
    </>
  );
}
