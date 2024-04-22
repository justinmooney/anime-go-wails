package main

import (
	"context"
	"strings"
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

func (a *App) GetAnimes(prefix string) []AnimeItem {
	if animes == nil {
		animes = fetchAnimes()
	}
	if prefix == "" {
		return *animes
	}

	prefix = strings.ToLower(prefix)
	filtered := make([]AnimeItem, 0)
	for _, a := range *animes {
		if strings.HasPrefix(strings.ToLower(a.Title), prefix) {
			filtered = append(filtered, a)
		}
	}
	return filtered
}
