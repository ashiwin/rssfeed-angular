import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  feedData: any[] = [];
  startIndex = 0;
  endIndex = 3;
  currentPage = 1;
  pageSize = 3;
  loading = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadFeedData();
  }

  loadFeedData() {
    this.loading = true;
    this.feedData = [];
    this.http.get('http://localhost:4201/rss', { responseType: 'text' }).subscribe(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, 'text/xml');
      const items = xml.getElementsByTagName('item');

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const url = new URL(item.getElementsByTagName('link')[0].textContent || '');
        this.feedData.push({
          title: item.getElementsByTagName('title')[0].textContent,
          link: url.origin + url.pathname,
          description: item.getElementsByTagName('description')[0].textContent,
          image: item.getElementsByTagName('media:thumbnail')[0].getAttribute('url'),
          pubdate: item.getElementsByTagName('pubDate')[0].textContent
        });
      }
      this.loading = false;
    });
  }

  previousPage() {
    this.startIndex -= this.pageSize;
    this.endIndex -= this.pageSize;
    this.currentPage--;
  }

  nextPage() {
    this.startIndex += this.pageSize;
    this.endIndex += this.pageSize;
    this.currentPage++;
  }

  reloadPage() {
    location.reload();
  }

  get totalPages() {
    return Math.ceil(this.feedData.length / this.pageSize);
  }
}
