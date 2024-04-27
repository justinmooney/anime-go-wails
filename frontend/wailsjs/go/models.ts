export namespace main {
	
	export class AnimeItem {
	    Title: string;
	    Synopsis: string;
	    StartDate: string;
	    EndDate: string;
	    CoverImage: string;
	
	    static createFrom(source: any = {}) {
	        return new AnimeItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Title = source["Title"];
	        this.Synopsis = source["Synopsis"];
	        this.StartDate = source["StartDate"];
	        this.EndDate = source["EndDate"];
	        this.CoverImage = source["CoverImage"];
	    }
	}

}

