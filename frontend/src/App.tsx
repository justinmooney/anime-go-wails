import { useState, ChangeEvent } from "react";
import "./App.css";
import { GetAnimes } from "../wailsjs/go/main/App";

type AnimeProps = {
  anime: Anime | null;
};

type Anime = {
  Title: string;
  StartDate: string;
  EndDate: string;
  Synopsis: string;
  CoverImage: string;
};

function Anime({ anime }: AnimeProps) {
  if (anime === null) {
    return <div></div>;
  }

  let startYear: string = anime.StartDate.slice(0, 4);
  let endYear: string = anime.EndDate.slice(0, 4);
  let dateString: string = `${startYear} - ${endYear}`;
  if (startYear === endYear) {
    dateString = startYear;
  }

  return (
    <div>
      <h1 className="title">
        {anime.Title} ({dateString})
      </h1>
      <hr />
      <p className="synopsis">{anime.Synopsis}</p>
      <img src={anime.CoverImage} height={anime.CoverImage ? "500" : "0"} />
    </div>
  );
}

function App() {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [animeList, setAnimeList] = useState(Array());
  const [loaded, setLoaded] = useState(false);

  function animeClicked(a: Anime) {
    setAnime(a);
  }

  function createButtons(list: Anime[]) {
    return list.map((a, i) => {
      console.log(i);
      return (
        <div>
          <button className="button" onClick={() => animeClicked(a)}>
            {a.Title}
          </button>
        </div>
      );
    });
  }

  function getAnimes(prefix: string) {
    GetAnimes(prefix).then((x: Anime[]) => {
      setAnimeList(createButtons(x));
      setAnime(x[0]);
    });
  }

  function filterList(e: ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    getAnimes(v);
  }

  if (!loaded) {
    getAnimes("");
    setLoaded(true);
  }

  return (
    <div id="App">
      <div className="row">
        <div>
          <input
            className="searchbox"
            type="text"
            placeholder="search..."
            onChange={filterList}
          />
          <div className="scroller">{animeList}</div>
        </div>
        <div className="display">
          <Anime anime={anime} />
        </div>
      </div>
    </div>
  );
}

export default App;
