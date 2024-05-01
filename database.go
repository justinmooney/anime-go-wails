package main

import (
	"bufio"
	"compress/gzip"
	"encoding/json"
	"errors"
	"os"
)

const (
	DBFILE = "./anime.gz"
)

type AnimeItem struct {
	Title      string `json:"Title"`
	Synopsis   string `json:"Synopsis"`
	StartDate  string `json:"StartDate"`
	EndDate    string `json:"EndDate"`
	CoverImage string `json:"CoverImage"`
}

func (a *App) DatabaseExists() bool {
	_, err := os.Stat(DBFILE)
	return !errors.Is(err, os.ErrNotExist)
}

func NewDBFile() chan []AnimeRecord {
	ch := make(chan []AnimeRecord)

	go func() {
		f, _ := os.Create(DBFILE)
		w := gzip.NewWriter(f)
		enc := json.NewEncoder(w)
		defer w.Close()

		for batch := range ch {
			for _, row := range batch {
				enc.Encode(row)
			}
		}
	}()

	return ch
}

func fetchAnimes() *[]AnimeItem {
	animes := make([]AnimeItem, 0)

	f, _ := os.Open(DBFILE)
	reader, _ := gzip.NewReader(f)
	scanner := bufio.NewScanner(reader)
	for scanner.Scan() {
		data := new(AnimeRecord)
		if err := json.Unmarshal(scanner.Bytes(), &data); err != nil {
			panic(err)
		}

		anime := AnimeItem{
			Title:      data.Attributes.CanonicalTitle,
			Synopsis:   data.Attributes.Synopsis,
			StartDate:  data.Attributes.StartDate,
			EndDate:    data.Attributes.EndDate,
			CoverImage: data.Attributes.CoverImage.Original,
		}

		animes = append(animes, anime)
	}
	if err := scanner.Err(); err != nil {
		panic(err)
	}

	return &animes
}
