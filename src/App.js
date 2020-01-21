import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Search } from './components/Search';

function App() {
  return (
    <div className="results">
                {searchResults ?
                    searchResults.map((element) => {
                        return (
                            <div className="search-result" key={element.id}>
                                {/* <Recommended title={element.title} id={element.id} release_date={element.release_date}></Recommended> */}
                                <Movie poster_path={element.poster_path} title={element.title} id={element.id} release_date={element.release_date} overview={element.overview}></Movie>
                            </div>
                        )
                    }) : <p>not found</p>
                }
            </div>)
}

export default App;
