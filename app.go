package main

import (
	"context"
	"fmt"
	"slices"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var animes *[]AnimeItem

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts.
// The context is saved so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) GetAnime(title string) *AnimeItem {
	anime := new(AnimeItem)
	for _, a := range *animes {
		if a.Title == title {
			anime = &a
			break
		}
	}
	return anime
}

func (a *App) GetAnimes(prefix string) []string {
	if animes == nil {
		animes = fetchAnimes()
	}

	titles := make([]string, 0)
	filterPrefix := strings.ToLower(prefix)

	if filterPrefix != "" {
		for _, a := range *animes {
			if strings.HasPrefix(strings.ToLower(a.Title), prefix) {
				titles = append(titles, a.Title)
			}
		}
	} else {
		for _, a := range *animes {
			titles = append(titles, a.Title)
		}
	}

	slices.Sort(titles)

	return titles
}

func (a *App) DoEvents() {
	dl := NewDownloader(10)
	go func() {
		progress := 0
		for p := range dl.Progress {
			progress += p
			runtime.EventsEmit(a.ctx, "DownloadProgress", []int{progress, dl.TotalPages})
			runtime.LogInfo(a.ctx, fmt.Sprintf("PROGRESS: %d", progress))
		}
	}()
	dl.Download()
}
