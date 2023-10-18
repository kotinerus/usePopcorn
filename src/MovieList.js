import { Movie } from "./Movie";

export function MovieList({ movies, handleFilmClick }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handleFilmClick={handleFilmClick}
        />
      ))}
    </ul>
  );
}
