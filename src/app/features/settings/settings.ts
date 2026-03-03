import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TitleService } from '../../core/services/title.service';

interface UserProfile {
    fullName: string;
    email: string;
    role: string;
    avatar: string;
}

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './settings.html',
    styleUrl: './settings.scss'
})
export class SettingsComponent implements OnInit {
    private titleService = inject(TitleService);
    private platformId = inject(PLATFORM_ID);

    profile = signal<UserProfile>({
        fullName: 'Admin User',
        email: 'admin@mednex.com',
        role: 'Administrator',
        avatar: 'AD'
    });

    notifications = signal({
        email: true,
        browser: true,
        sms: false
    });

    darkMode = signal(false);

    ngOnInit() {
        this.titleService.setTitle('System Settings');
        if (isPlatformBrowser(this.platformId)) {
            this.loadPreferences();
        }
    }

    loadPreferences() {
        // Simulation: Load from local storage
        const stored = localStorage.getItem('user_prefs');
        if (stored) {
            const prefs = JSON.parse(stored);
            this.darkMode.set(prefs.darkMode);
            this.notifications.set(prefs.notifications);
        }
    }

    saveSettings() {
        if (isPlatformBrowser(this.platformId)) {
            const prefs = {
                darkMode: this.darkMode(),
                notifications: this.notifications()
            };
            localStorage.setItem('user_prefs', JSON.stringify(prefs));
            // In a real app, we'd also call a backend API here
            alert('Settings saved successfully!');
        }
    }

    toggleDarkMode() {
        this.darkMode.update(v => !v);
        if (isPlatformBrowser(this.platformId)) {
            document.body.classList.toggle('dark-mode', this.darkMode());
        }
    }
}
