import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SensorData } from '../../modelos/sensor.model';

@Component({
  selector: 'app-sensor-card',
  standalone: true,
  imports: [CommonModule, DecimalPipe, MatIconModule, MatTooltipModule],
  templateUrl: './sensor-card.component.html',
  styleUrl: './sensor-card.component.css',
})
export class SensorCardComponent {
  @Input({ required: true }) sensor!: SensorData;
  @Output() sensorClick = new EventEmitter<SensorData>();

  onClick(): void {
    this.sensorClick.emit(this.sensor);
  }

  get porcentaje(): number {
    if (!this.sensor || this.sensor.max === this.sensor.min) return 0;
    const pct = ((this.sensor.valor - this.sensor.min) / (this.sensor.max - this.sensor.min)) * 100;
    return Math.max(0, Math.min(100, Math.round(pct)));
  }

  get chartType(): 'line' | 'bars' | 'dashed' {
    return 'line'; // Usar el diseño más limpio y elegante (curva suave con degradado)
  }

  get chartBars(): { bars: { x: number, y: number, width: number, height: number }[], linePath: string } {
    const hist = this.sensor?.historial || [];
    if (hist.length < 2) return { bars: [], linePath: '' };

    let min = Math.min(...hist);
    let max = Math.max(...hist);
    if (max - min < 2) {
      const mid = (max + min) / 2;
      min = mid - 1; max = mid + 1;
    } else {
      const padding = (max - min) * 0.05;
      min -= padding; max += padding;
    }

    const range = max - min || 1;
    const width = 300;
    const height = 55;
    const padTop = 4;
    const padBottom = 2;
    const chartHeight = height - padTop - padBottom;
    const maxBars = 15;
    const displayHist = hist.slice(-maxBars);
    
    const barWidth = 6;
    const gap = (width - (displayHist.length * barWidth)) / (displayHist.length - 1);

    const bars = displayHist.map((val, idx) => {
      const h = ((val - min) / range) * chartHeight;
      return {
        x: +(idx * (barWidth + gap)).toFixed(1),
        y: +(height - padBottom - h).toFixed(1),
        width: barWidth,
        height: +Math.max(4, h).toFixed(1)
      };
    });

    let linePath = '';
    if (bars.length > 0) {
      linePath = `M ${+(bars[0].x + barWidth/2).toFixed(1)},${bars[0].y}`;
      for (let i = 1; i < bars.length; i++) {
        linePath += ` L ${+(bars[i].x + barWidth/2).toFixed(1)},${bars[i].y}`;
      }
    }

    return { bars, linePath };
  }

  get chartPath(): { line: string; area: string; pointsArray: {x:number, y:number}[]; lastPoint: { x: number; y: number } | null } {
    const hist = this.sensor?.historial || [];
    if (hist.length < 2) return { line: '', area: '', pointsArray: [], lastPoint: null };

    let min = Math.min(...hist);
    let max = Math.max(...hist);
    
    if (max - min < 2) {
      const mid = (max + min) / 2;
      min = mid - 1; max = mid + 1;
    } else {
      const padding = (max - min) * 0.1;
      min -= padding; max += padding;
    }
    
    const range = max - min || 1;
    const width = 300;
    const height = 55;
    const padTop = 4;
    const padBottom = 2;
    const chartHeight = height - padTop - padBottom;
    const step = width / (hist.length - 1);

    const points = hist.map((val, idx) => {
      const y = height - padBottom - ((val - min) / range) * chartHeight;
      return { x: +(idx * step).toFixed(1), y: +y.toFixed(1) };
    });

    let linePath = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 >= points.length ? points.length - 1 : i + 2];
      const cp1x = +(p1.x + (p2.x - p0.x) / 6).toFixed(1);
      const cp1y = +(p1.y + (p2.y - p0.y) / 6).toFixed(1);
      const cp2x = +(p2.x - (p3.x - p1.x) / 6).toFixed(1);
      const cp2y = +(p2.y - (p3.y - p1.y) / 6).toFixed(1);
      linePath += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }

    const last = points[points.length - 1];
    const first = points[0];
    const areaPath = `${linePath} L ${last.x},${height} L ${first.x},${height} Z`;

    return { line: linePath, area: areaPath, pointsArray: points, lastPoint: last };
  }
}
