import React, { useState, useRef, useEffect } from "react";
import { Element, scroller, animateScroll as scroll } from 'react-scroll';
import '../App.css';
import Movie from "./Movie";
const axios = require('axios').default;

export const Search = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');
    const [selectedMovie, setSelectedMovie] = useState([]);
    const [backgroundImage, setBgImage] = useState([]);
    const [message, setMessage] = useState("");
    const refContainer = useRef('');

    useEffect(() => {
        axios.get(`https://lucky-smoke-8bb3.cors-bypass.workers.dev/?https://api.themoviedb.org/3/discover/movie?api_key=acf4ef5820f3e83505c36c1c840be2ee&page=${Math.floor((Math.random() * 500) + 0)}`)
            .then(response => {
                let x = Math.floor((Math.random() * 20) + 0);
                let bgImage = response.data.results.map(e => [e.backdrop_path, e.title]);
                setBgImage(bgImage[x]);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    const scrollTo = (where) => {
        scroller.scrollTo(where, {
            duration: 600,
            delay: 0,
            smooth: 'easeInOutQuart'
        })
    }
    const scrollToTop = () => {
        scroll.scrollToTop();
    }
    const fetchSource = (isSearch = true, movie = []) => {

        const apiSearchMovie = `https://lucky-smoke-8bb3.cors-bypass.workers.dev/?https://api.themoviedb.org/3/search/movie?api_key=acf4ef5820f3e83505c36c1c840be2ee&language=en-US&query=${refContainer.current.value}&page=1&include_adult=false`;
        const apiGetRecommended = `https://lucky-smoke-8bb3.cors-bypass.workers.dev/?https://api.themoviedb.org/3/movie/${movie.id}/recommendations?api_key=acf4ef5820f3e83505c36c1c840be2ee&language=en-US&page=1`;
        axios.get(isSearch ? apiSearchMovie : apiGetRecommended)
            .then(response => {
                // handle success
                setSearchResults(response.data.total_results && response.data.results);
                setSelectedMovie(movie);
                scrollTo('results-container');
                if (response.data.total_results === 0 && isSearch) {
                    setError('No movies found.')
                    setSearchResults(null);
                } else if (response.data.total_results === 0 && !isSearch) {
                    setError('There are no movies recommended.')
                    setSearchResults(null);
                } else if (selectedMovie.length !== 0 && isSearch === false) {
                    scrollTo('results-container');
                    setError(null);
                    setMessage(<p>Keep selecting movies to get more recommendations. Or <span className="search-link" onClick={() => scrollToTop()}>search</span> a different movie to get different recommendations.</p>)
                } else if (isSearch && response.data.total_results) {
                    setMessage('These are the results for your search, select one:');
                    setError(null);
                }
                else if (isSearch === false && selectedMovie) {
                    setMessage('Here\'s the movie you choosed, scroll down to check the recommendations!')
                    setError(null);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    return (
        <div className="content">
            <div className="search-container" style={{ backgroundImage: `url(https://lucky-smoke-8bb3.cors-bypass.workers.dev/?https://image.tmdb.org/t/p/w1280${backgroundImage[0]}` }}>
                <div className="search-content">
                    <div className="header">
                        <h2 className="big-header">Recommend-A-Movie</h2>
                        <h3>Search for a movie and get recommendations!</h3>
                    </div>
                    <form className="form" onSubmit={(e) => (e.preventDefault())}>
                        <input ref={refContainer} name="moviename" type="text" />
                        <input onClick={() => fetchSource(true)} type="submit" value="GO!" />
                    </form>
                    {error && <p className="error">{error}</p>}
                    <div className="overlay"></div>
                    <span className="bg-name">{backgroundImage[1]}</span>
                </div>
            </div>
            {refContainer.current.value && searchResults !== null &&
                <Element name="results-container">
                    <div className="results-container">
                        {searchResults && <h3>{message}</h3>}
                        {selectedMovie.length !== 0 && searchResults &&
                            <div className="selected-movie">
                                <Movie poster_path={selectedMovie.poster_path} title={selectedMovie.title} release_date={selectedMovie.release_date} overview={selectedMovie.overview}></Movie>
                            </div>}
                        <Element name="results">
                        {refContainer.current.value && selectedMovie.title && searchResults && <h2>Recommended movies based on {selectedMovie.title}</h2>}
                            <div className="results">
                                {searchResults ?
                                    searchResults.map((movie) => {
                                        return <Movie key={movie.id} onClick={() => fetchSource(false, movie)} poster_path={movie.poster_path} title={movie.title} id={movie.id} release_date={movie.release_date} overview={movie.overview}></Movie>
                                    }) : error === 'not-found'}
                            </div>
                        </Element>
                    </div>
                    <span className="toTop" onClick={() => scrollToTop()}>&uarr;</span>
                </Element>}
        </div>

        // https://image.tmdb.org/t/p/w600_and_h900_bestv2/qNeGtQaatgMGrS60xZ0yMOVblVJ.jpg
    )
}