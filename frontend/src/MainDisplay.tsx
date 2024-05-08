import { main as models } from "../wailsjs/go/models";

export default function ({ anime }: AnimeProps) {
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

type AnimeProps = {
  anime: models.AnimeItem | null;
};
