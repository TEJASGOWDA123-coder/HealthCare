import { Component } from '@angular/core';

@Component({
    selector: 'app-coming-soon',
    standalone: true,
    template: `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #64748b;">
      <span class="material-icons-round" style="font-size: 4rem; margin-bottom: 1rem; color: #0d9488;">engineering</span>
      <h2 style="margin: 0;">Feature Coming Soon</h2>
      <p style="margin-top: 0.5rem;">We're working hard to bring you this module. Stay tuned!</p>
    </div>
  `,
})
export class ComingSoon { }
