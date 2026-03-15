import { Injectable, signal, effect } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'mednex-theme';
    theme = signal<'light' | 'dark'>(this.getInitialTheme());

    constructor() {
        // Effect to apply the theme to the document whenever it changes
        effect(() => {
            const currentTheme = this.theme();
            document.documentElement.setAttribute('data-theme', currentTheme);
            localStorage.setItem(this.THEME_KEY, currentTheme);
        });
    }

    toggleTheme() {
        this.theme.update(t => t === 'light' ? 'dark' : 'light');
    }

    private getInitialTheme(): 'light' | 'dark' {
        const savedTheme = localStorage.getItem(this.THEME_KEY) as 'light' | 'dark';
        if (savedTheme) {
            return savedTheme;
        }
        // Fallback to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
}
