import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TitleService {
    title = signal('Dashboard');

    setTitle(newTitle: string) {
        this.title.set(newTitle);
    }
}
