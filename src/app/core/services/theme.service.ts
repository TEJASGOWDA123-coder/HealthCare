import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'mednex-theme';
    private platformId = inject(PLATFORM_ID);
    theme = signal<'light' | 'dark'>('light');

    constructor() {
        // Apply light theme as default on boot
        if (isPlatformBrowser(this.platformId)) {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    toggleTheme() {
        // No-op or just set to light to avoid breaking existing callers
        this.theme.set('light');
    }

    private getInitialTheme(): 'light' | 'dark' {
        return 'light';
    }
}
