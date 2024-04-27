import { useState, ChangeEvent } from "react";
import "./App.css";
import { GetAnimes, DoEvents } from "../wailsjs/go/main/App";
import { EventsOn, EventsOff, LogInfo } from "../wailsjs/runtime";

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

function MainDisplay({ anime }: AnimeProps) {
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

function LoaderPage() {
  const [progress, setProgress] = useState(Array(0.0, 0.0));

  function start() {
    setProgress([0.0, 0.0]);
    EventsOn("DownloadProgress", (x) => {
      setProgress(x);
    });
    DoEvents();
  }

  function cancel() {
    EventsOff("DownloadProgress");
    setProgress([0.0, 0.0]);
  }

  function content() {
    if (progress[0] == 0) {
      return <button onClick={start}>get em</button>;
    } else {
      return (
        <div>
          <button onClick={cancel}>cancel</button>
          <div>
            <progress value={progress[0] / 100} />
          </div>
          <div>
            {Math.floor(progress[0])}/{progress[1]}
          </div>
        </div>
      );
    }
  }

  return (
    <div>
      <h1>get dem animes</h1>
      {content()}
    </div>
  );
}

function App() {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [animeList, setAnimeList] = useState(Array());
  const [loaded, setLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  function animeClicked(a: Anime) {
    setAnime(a);
  }

  function createButtons(list: Anime[]) {
    return list.map((a) => {
      return (
        <div>
          <button
            id={a.Title}
            className="list-item"
            onClick={() => animeClicked(a)}
          >
            {a.Title}
          </button>
        </div>
      );
    });
  }

  function getAnimes(prefix: string) {
    setSearchTerm(prefix);
    GetAnimes(prefix).then((x: Anime[]) => {
      setAnimeList(createButtons(x));
      if (x.length == 0) {
        return;
      }
      setAnime(x[0]);
    });
  }

  function getRandomAnime() {
    setSearchTerm("");
    GetAnimes("").then((a: Anime[]) => {
      setAnimeList(createButtons(a));
      const randomIndex = Math.floor(Math.random() * a.length);
      setAnime(a[randomIndex]);

      const element = document.getElementById(a[randomIndex].Title);
      if (element != null) {
        element.scrollIntoView({ behavior: "smooth" });
        element.focus();
      }
    });
  }

  function filterList(e: ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    getAnimes(v);
  }

  if (true) {
    return LoaderPage();
  }

  if (!loaded) {
    getAnimes("");
    setLoaded(true);
  }
  return (
    <div id="App">
      <div className="row">
        <div>
          <div className="row">
            <input
              className="searchbox"
              type="text"
              placeholder="search..."
              value={searchTerm}
              onChange={filterList}
            />
            <button className="random-button" onClick={getRandomAnime}>
              random
            </button>
          </div>
          <div className="scroller">{animeList}</div>
        </div>
        <div className="display">
          <MainDisplay anime={anime} />
        </div>
      </div>
    </div>
  );
}

export default App;
