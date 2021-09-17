import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Song, SongPlatform } from "@tableaubits/hang";
import * as URLParse from "url-parse";

export function getIDFromURL(song: Song): string {
  switch (song.platform) {
    case SongPlatform.YOUTUBE: {
      const parsedURL = new URLParse(song.url, true);
      let videoID = "i2-a5itIPy4"; // "X_dkdW3EG5Q" // "LmMfALLf1jo" // "dQw4w9WgXcQ";
      if (parsedURL.hostname === "youtu.be") { videoID = parsedURL.pathname.split("/")[1] }
      if (parsedURL.hostname === "www.youtube.com") { videoID = parsedURL.query["v"] ?? "" }
      return videoID;
    }

    default: return "";
  }
}

export function getEmbedURL(song: Song, sanitizer: DomSanitizer): SafeResourceUrl {
  switch (song.platform) {
    case SongPlatform.YOUTUBE: {
      const videoID = getIDFromURL(song);
      return sanitizer.bypassSecurityTrustResourceUrl(`https://youtube.com/embed/${videoID}`);
    }

    default:
      return "";
  }
}