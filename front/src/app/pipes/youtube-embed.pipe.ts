import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'youtubeEmbed',
  standalone: true
})

export class YoutubeEmbedPipe implements PipeTransform {

  transform(url: string): string {
    if (!url) return '';

    const videoId = this.getVideoId(url);
    if (!videoId) return '';

    return `https://www.youtube.com/embed/${videoId}`;
  }

  private getVideoId(url: string): string | null {
    // Extract video ID from URL, assuming various formats
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}
