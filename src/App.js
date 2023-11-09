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
  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);
  });

  function handleFilmClick(id) {
    setSelectedId(id);
  }
  function handleClose() {
    setSelectedId(null);
  }
  function handleAddWatched(movie) {
    const isNotInList = !(
      watched.filter((e) => e.imdbID === movie.imdbID).length > 0
    );
    isNotInList && setWatched((watched) => [...watched, movie]);
    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }
  function handleDeleteFilm(movie) {
    setWatched(watched.filter((e) => e.imdbID !== movie.imdbID));
  }
  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );
  useEffect(function () {
    document.addEventListener("keydown", function (e) {
      if (e.code === "Escape") {
        handleClose();
      }
    });
  }, []);
  useEffect(
    function () {
      const controler = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
            { signal: controler.signal }
          );
          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
        } catch (err) {
          console.log(err.message);

          if (err.name !== "AbortError") {
            setError(err.message);
          }
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

      return function () {
        controler.abort();
      };
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
        handleDeleteFilm={handleDeleteFilm}
      />
    </>
  );
}
