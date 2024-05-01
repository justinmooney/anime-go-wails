package main

import (
	"fmt"
	"sync"
)

const BASEURL = "https://kitsu.io/api/edge/anime"

type Downloader struct {
	Progress   chan int
	baseURL    string
	pageSize   int
	TotalPages int
}

func NewDownloader(pageSize int) *Downloader {
	dl := new(Downloader)
	dl.pageSize = pageSize
	dl.baseURL = dl.getBaseURL()
	dl.TotalPages = dl.initialize()
	dl.Progress = make(chan int)
	return dl
}

func (dl *Downloader) initialize() int {
	// info := doRequest(dl.baseURL)
	// lastURL, _ := url.Parse(info.Links.Last)
	// params, _ := url.ParseQuery(lastURL.RawQuery)
	// total, _ := strconv.Atoi(params["page[offset]"][0])

	total := 1000 // for testing
	return total
}

func (dl *Downloader) getBaseURL() string {
	return fmt.Sprintf("%s?page[limit]=%d", BASEURL, dl.pageSize)
}

func (dl *Downloader) getPageURL(offset int) string {
	return fmt.Sprintf("%s&page[offset]=%d", dl.baseURL, offset)
}

func (dl *Downloader) Download() {
	defer close(dl.Progress)

	semChan := make(chan int, 64)
	defer close(semChan)

	insertChan := NewDBFile()
	defer close(insertChan)

	var wg sync.WaitGroup

	page := 0
	for page < dl.TotalPages {
		wg.Add(1)
		semChan <- 1
		next := dl.getPageURL(page * dl.pageSize)
		go func(u string) {
			batch := doRequest(u)
			<-semChan
			insertChan <- batch.Data
			dl.Progress <- 1
			wg.Done()
		}(next)
		page += 1
	}

	wg.Wait()
}
