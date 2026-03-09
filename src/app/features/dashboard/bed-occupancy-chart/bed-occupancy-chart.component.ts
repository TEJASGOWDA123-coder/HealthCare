import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-bed-occupancy-chart',
    standalone: true,
    imports: [CommonModule, BaseChartDirective],
    template: `
    <div class="chart-container card p-4">
      <h3>Bed Occupancy Overview</h3>
      <div style="display: block;">
        <canvas baseChart
          [data]="pieChartData()"
          [options]="pieChartOptions"
          [type]="pieChartType">
        </canvas>
      </div>
      <div class="stats-footer mt-3" *ngIf="stats()">
        <p>Total Beds: {{stats()?.total}}</p>
        <p>Occupied: {{stats()?.occupied}}</p>
        <p>Available: {{stats()?.available}}</p>
      </div>
    </div>
  `,
    styles: [`
    .chart-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      height: 100%;
    }
    h3 {
      font-weight: 600;
      color: #333;
      margin-bottom: 20px;
    }
  `]
})
export class BedOccupancyChartComponent implements OnInit {
    private http = inject(HttpClient);
    stats = signal<any>(null);

    public pieChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            }
        }
    };

    public pieChartData = signal<ChartData<'pie', number[], string | string[]>>({
        labels: ['Occupied', 'Available'],
        datasets: [{
            data: [0, 0],
            backgroundColor: ['#e63946', '#2a9d8f'],
            hoverBackgroundColor: ['#d62828', '#21867a'],
            borderWidth: 0
        }]
    });

    public pieChartType: ChartType = 'pie';

    ngOnInit() {
        this.loadStats();
    }

    loadStats() {
        this.http.get<any>(`${environment.apiBaseUrl}/api/v1/dashboard/bed-occupancy`).subscribe(data => {
            this.stats.set(data);
            this.pieChartData.update(chartData => ({
                ...chartData,
                datasets: [{
                    ...chartData.datasets[0],
                    data: [data.occupied, data.available]
                }]
            }));
        });
    }
}
