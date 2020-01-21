import React from "react"
import notfound from '../not-found.png';

const Movie = (props) => {
    return (
        props !== undefined &&
            <div className="movie-card" onClick={props.onClick} >
                <img className="poster-image" src={props.poster_path ? `https://lucky-smoke-8bb3.cors-bypass.workers.dev/?https://image.tmdb.org/t/p/w600_and_h900_bestv2${props.poster_path}` : notfound} alt="" />
                <div className="movie-data">
                    <h1>{props.title} {props.release_date && <span>({props.release_date.substring(0, 4)})</span>}</h1>
                    <p>{props.overview}</p></div>
            </div>
    )
}

export default Movie;