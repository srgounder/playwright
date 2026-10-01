import { spawn } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

type ReporterOptions = {
  reportFolder: string;
  testEnvironment: string;
  runTimestamp: string;
  open: boolean;
};

type RecordedResult = {
  status: TestResult['status'];
  retry: number;
};

const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => htmlEntities[character]);

export default class PieChartReporter implements Reporter {
  private readonly results = new Map<string, RecordedResult>();

  constructor(private readonly options: ReporterOptions) {}

  onTestEnd(test: TestCase, result: TestResult) {
    this.results.set(test.id, { status: result.status, retry: result.retry });
  }

  async onExit() {
    try {
      const reportPath = path.resolve(this.options.reportFolder, 'index.html');
      const html = await readFile(reportPath, 'utf8');
      const summary = this.createSummary();
      const rootMarker = "<div id='root'></div>";

      if (!html.includes(rootMarker)) {
        throw new Error(`Could not find the Playwright report root in ${reportPath}`);
      }

      await writeFile(reportPath, html.replace(rootMarker, `${summary}${rootMarker}`));

      if (this.options.open) {
        const cliPath = path.resolve('node_modules/playwright/cli.js');
        const child = spawn(process.execPath, [cliPath, 'show-report', this.options.reportFolder], {
          detached: true,
          stdio: 'ignore',
        });
        child.on('error', (error) => console.error('Could not open the Playwright report:', error));
        child.unref();
      }
    } catch (error) {
      console.error('Could not add the results pie chart to the Playwright report:', error);
    }
  }

  private createSummary() {
    const counts = { passed: 0, flaky: 0, failed: 0, skipped: 0 };
    for (const result of this.results.values()) {
      if (result.status === 'passed') {
        counts[result.retry > 0 ? 'flaky' : 'passed'] += 1;
      } else if (result.status === 'skipped') {
        counts.skipped += 1;
      } else {
        counts.failed += 1;
      }
    }

    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    const segments = [
      { label: 'Passed', count: counts.passed, color: '#15ae0d' },
      { label: 'Flaky', count: counts.flaky, color: '#c58a24' },
      { label: 'Failed', count: counts.failed, color: '#e61717' },
      { label: 'Skipped', count: counts.skipped, color: '#737b83' },
    ];
    let currentAngle = 0;
    const gradient = total === 0
      ? '#d9dde0 0deg 360deg'
      : segments
          .filter((segment) => segment.count > 0)
          .map((segment, index, activeSegments) => {
            const startAngle = currentAngle;
            currentAngle = index === activeSegments.length - 1
              ? 360
              : currentAngle + (segment.count / total) * 360;
            return `${segment.color} ${startAngle}deg ${currentAngle}deg`;
          })
          .join(', ');
    const legend = segments
      .map((segment) => `
        <li><span class="carepro-swatch" style="background:${segment.color}"></span>${segment.label}<strong>${segment.count}</strong></li>`)
      .join('');
    let labelAngle = 0;
    const pieLabels = total === 0
      ? ''
      : segments
          .filter((segment) => segment.count > 0)
          .map((segment) => {
            const segmentAngle = (segment.count / total) * 360;
            const midpoint = (labelAngle + segmentAngle / 2 - 90) * (Math.PI / 180);
            labelAngle += segmentAngle;
            const radius = 29;
            const left = 50 + (Math.cos(midpoint) * radius / 38) * 50;
            const top = 50 + (Math.sin(midpoint) * radius / 38) * 50;
            const percentage = Number(((segment.count / total) * 100).toFixed(1));
            return `<span class="carepro-pie-label" style="left:${left.toFixed(1)}%;top:${top.toFixed(1)}%" title="${segment.label}: ${percentage}%">${percentage}%</span>`;
          })
          .join('');
    const title = `CarePro Results | ${this.options.testEnvironment} | ${this.options.runTimestamp} UTC`;

    return `
<section id="carepro-run-summary" aria-label="CarePro test results summary">
  <style>
    #carepro-run-summary{box-sizing:border-box;display:flex;align-items:center;gap:18px;padding:14px 20px;border-bottom:1px solid #d8dcdf;background:#f5f7f6;color:#202729;font:14px/1.4 "Segoe UI",sans-serif}
    #carepro-run-summary *{box-sizing:border-box}
    #carepro-run-summary .carepro-pie{width:76px;height:76px;flex:none;border-radius:50%;background:conic-gradient(${gradient});border:1px solid #ffffff;box-shadow:0 0 0 1px #cbd1d2}
    #carepro-run-summary .carepro-pie{position:relative}
    #carepro-run-summary .carepro-pie-label{position:absolute;z-index:1;transform:translate(-50%,-50%);color:#fff;font-size:9px;font-weight:700;line-height:1;text-shadow:0 1px 2px #202729,0 0 2px #202729;white-space:nowrap}
    #carepro-run-summary .carepro-summary-content{min-width:0}
    #carepro-run-summary .carepro-summary-title{font-weight:650}
    #carepro-run-summary .carepro-summary-meta{margin-top:2px;color:#566164;font-size:12px;overflow-wrap:anywhere}
    #carepro-run-summary ul{display:flex;flex-wrap:wrap;gap:8px 18px;margin:8px 0 0;padding:0;list-style:none}
    #carepro-run-summary li{display:flex;align-items:center;gap:6px;white-space:nowrap}
    #carepro-run-summary .carepro-swatch{width:9px;height:9px;border-radius:50%;flex:none}
    #carepro-run-summary li strong{font-variant-numeric:tabular-nums}
    @media(max-width:520px){#carepro-run-summary{align-items:flex-start;gap:12px;padding:12px}#carepro-run-summary .carepro-pie{width:60px;height:60px}#carepro-run-summary .carepro-sample-chart{display:none}#carepro-run-summary ul{gap:6px 12px}}
  </style>
  <div class="carepro-pie" role="img" aria-label="Results: ${counts.passed} passed, ${counts.flaky} flaky, ${counts.failed} failed, ${counts.skipped} skipped">${pieLabels}</div>
  <div class="carepro-summary-content">
    <div class="carepro-summary-title">${total} tests | ${escapeHtml(title)}</div>
    <div class="carepro-summary-meta">Environment: ${escapeHtml(this.options.testEnvironment)} | ${escapeHtml(this.options.runTimestamp)} UTC</div>
    <ul>${legend}
    </ul>
  </div>
</section>`;
  }
}