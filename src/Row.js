import React, { useState, useEffect } from "react";
import "./Row.css";
import axios from "./axios";
import YouTube from "react-youtube";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [movieName, setMovieName] = useState("");

  const base_url = "https://image.tmdb.org/t/p/original/";

  //run snippet when row is loaded
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const movieTrailer = require("movie-trailer");

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      setMovieName(movie?.title || movie?.name || movie?.original_name);
      movieTrailer(movieName || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          const trailer = urlParams.get("v");
          console.log(trailer);
          setTrailerUrl(trailer);
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row__posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movies.name}
          />
        ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
