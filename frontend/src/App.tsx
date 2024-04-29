import "./App.css";
import { useState, ChangeEvent } from "react";
import {
  GetAnimes,
  DoEvents,
  DatabaseExists,
  GetAnime,
} from "../wailsjs/go/main/App";
import { EventsOn, EventsOff, LogInfo } from "../wailsjs/runtime";
import { main as models } from "../wailsjs/go/models";

type AnimeProps = {
  anime: models.AnimeItem | null;
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

function LoaderPage(
  start: () => void,
  cancel: () => void,
  progress: Array<number>,
) {
  function content() {
    if (progress[0] == 0) {
      return <button onClick={start}>get em</button>;
    } else {
      return (
        <div>
          {/* <button onClick={cancel}>cancel</button> */}
          <div>
            <progress value={progress[0] / progress[1]} />
          </div>
          <div>
            {Math.floor(progress[0])}/{progress[1]}
          </div>
        </div>
      );
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "40%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <h1>get dem animes</h1>
      {content()}
    </div>
  );
}

function App() {
  const [anime, setAnime] = useState<models.AnimeItem | null>(null);
  const [animeList, setAnimeList] = useState(Array());
  const [loaded, setLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [progress, setProgress] = useState(Array(0.0, 0.0));
  const [downloading, setDownloading] = useState(false);
  const [needsInit, setNeedsInit] = useState(true);

  function start() {
    setProgress([0.0, 0.0]);
    EventsOn("DownloadProgress", (x) => {
      setProgress(x);
    });
    DoEvents();
    setDownloading(true);
    setNeedsInit(false);
  }

  function cancel() {
    EventsOff("DownloadProgress");
    setProgress([0.0, 0.0]);
  }

  function setDisplayedAnime(title: string) {
    GetAnime(title).then((a: models.AnimeItem) => {
      setAnime(a);
    });
  }

  function animeClicked(title: string) {
    setDisplayedAnime(title);
  }

  function createButtons(list: string[]) {
    return list.map((title) => {
      return (
        <div>
          <button
            id={title}
            className="list-item"
            onClick={() => animeClicked(title)}
          >
            {title}
          </button>
        </div>
      );
    });
  }

  function selectAnime(title: string, select: boolean) {
    setDisplayedAnime(title);
    if (!select) {
      return;
    }
    const element = document.getElementById(title);
    if (element != null) {
      element.scrollIntoView({ behavior: "smooth" });
      // TODO: highlight the button without focusing it
      element.focus();
    }
  }

  function getAnimes(prefix: string) {
    setSearchTerm(prefix);
    GetAnimes(prefix).then((titles: string[]) => {
      setAnimeList(createButtons(titles));
      if (titles.length == 0) {
        return;
      }
    });
  }

  function getRandomAnime() {
    setSearchTerm("");
    GetAnimes("").then((titles: string[]) => {
      setAnimeList(createButtons(titles));
      const randomIndex = Math.floor(Math.random() * titles.length);
      selectAnime(titles[randomIndex], true);
    });
  }

  function filterList(e: ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    getAnimes(v);
  }

  if (needsInit) {
    DatabaseExists().then((x) => {
      setNeedsInit(!x);
      LogInfo("NEED TO INIT");
    });
  }

  if (downloading && progress[0] > 0 && progress[0] == progress[1]) {
    setNeedsInit(false);
    setDownloading(false);
  }

  if (needsInit || downloading) {
    return LoaderPage(start, cancel, progress);
  }

  if (!loaded) {
    getRandomAnime();
    setLoaded(true);
  }

  return (
    <div id="App">
      <div className="row">
        <div>
          <div className="row">
            <input
              id="input-box"
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
