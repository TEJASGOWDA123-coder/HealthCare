import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'mednex-theme';
    private platformId = inject(PLATFORM_ID);
    theme = signal<'light' | 'dark'>(this.getInitialTheme());

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            effect(() => {
                const currentTheme = this.theme();
                document.documentElement.setAttribute('data-theme', currentTheme);
                localStorage.setItem(this.THEME_KEY, currentTheme);
            });
        }
    }

    toggleTheme() {
        this.theme.update(t => t === 'light' ? 'dark' : 'light');
    }

    private getInitialTheme(): 'light' | 'dark' {
        if (isPlatformBrowser(this.platformId)) {
            const saved = localStorage.getItem(this.THEME_KEY);
            if (saved === 'light' || saved === 'dark') return saved;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    }
}
