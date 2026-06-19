import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useConverterStore } from '../store/useConverterStore'
import { useUIStore } from '../store/useUIStore'
import { getTimeSeries } from '../api/frankfurter'
import { formatRate, formatDate } from '../lib/format'
import type { ChartStats } from '../types/currency'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

const ranges = ['1D', '1W', '1M', '3M', '1Y', '5Y'] as const

function getDateRange(range: string): { start: string; end: string } {
  const end = new Date()
  const start = new Date()
  switch (range) {
    case '1D': start.setDate(end.getDate() - 1); break
    case '1W': start.setDate(end.getDate() - 7); break
    case '1M': start.setMonth(end.getMonth() - 1); break
    case '3M': start.setMonth(end.getMonth() - 3); break
    case '1Y': start.setFullYear(end.getFullYear() - 1); break
    case '5Y': start.setFullYear(end.getFullYear() - 5); break
  }
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  }
}

export default function HistoryTab() {
  const { base, target } = useConverterStore()
  const chartRange = useUIStore((s) => s.chartRange)
  const setChartRange = useUIStore((s) => s.setChartRange)

  const [points, setPoints] = useState<{ date: string; rate: number }[]>([])
  const [stats, setStats] = useState<ChartStats | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setError(false)
    const { start, end } = getDateRange(chartRange)

    getTimeSeries(base, target, start, end)
      .then((data) => {
        const pts = data.map((d) => ({ date: d.date, rate: d.rate }))

        setPoints(pts)

        if (pts.length > 0) {
          const first = pts[0].rate
          const last = pts[pts.length - 1].rate
          setStats({
            open: first,
            last,
            change: last - first,
            percentChange: ((last - first) / first) * 100,
          })
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [base, target, chartRange])

  const chartData = {
    labels: points.map((p) => p.date),
    datasets: [
      {
        data: points.map((p) => p.rate),
        borderColor: '#cef739',
        backgroundColor: function (this: void, ctx: { chart: { ctx: CanvasRenderingContext2D } }) {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400)
          gradient.addColorStop(0, 'rgba(206, 247, 57, 0.15)')
          gradient.addColorStop(1, 'rgba(206, 247, 57, 0)')
          return gradient
        },
        fill: true,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: '#1e1e1e',
        titleColor: '#9d9d9d',
        bodyColor: '#ffffff',
        borderColor: '#2a2a2a',
        borderWidth: 1,
          callbacks: {
            label: function (ctx: { parsed: { y: number | null } }) {
              const val = ctx.parsed.y
              return val !== null ? formatRate(val) : ''
            },
          },
      },
      legend: { display: false },
    },
    scales: {
      x: {
        display: true,
        ticks: {
          color: '#6b6b6b',
          maxTicksLimit: 8,
          maxRotation: 0,
          callback: (value: string | number) => {
            const label = chartData.labels[Number(value)]
            return label ? formatDate(String(label), chartRange) : ''
          },
        },
        grid: { display: false },
      },
      y: {
        display: true,
        ticks: {
          color: '#6b6b6b',
          maxTicksLimit: 5,
          callback: (value: string | number) => formatRate(Number(value)),
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
  }

  return (
    <div className="p-5 lg:p-6">
      <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Stats bar */}
        {stats && (
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            <div className="rounded-xl bg-surface-700/40 px-5 py-3 shrink-0 min-w-[110px]">
              <Stat label="Open" value={formatRate(stats.open)} />
            </div>
            <div className="rounded-xl bg-surface-700/40 px-5 py-3 shrink-0 min-w-[110px]">
              <Stat label="Last" value={formatRate(stats.last)} />
            </div>
            <div className="rounded-xl bg-surface-700/40 px-5 py-3 shrink-0 min-w-[110px]">
              <Stat
                label="Change"
                value={`${stats.change >= 0 ? '+' : ''}${formatRate(stats.change)}`}
                positive={stats.change >= 0}
              />
            </div>
            <div className="rounded-xl bg-surface-700/40 px-5 py-3 shrink-0 min-w-[110px]">
              <Stat
                label="% change"
                value={`${stats.percentChange >= 0 ? '▲ +' : '▼ '}${Math.abs(stats.percentChange).toFixed(2)}%`}
                positive={stats.percentChange >= 0}
              />
            </div>
          </div>
        )}

        {/* Range selector */}
        <div className="flex gap-1 shrink-0 rounded-lg bg-surface-700/30 p-1" role="tablist" aria-label="Chart range">
          {ranges.map((r) => (
            <button
              key={r}
              role="tab"
              aria-selected={chartRange === r}
              onClick={() => setChartRange(r)}
              className={`cursor-pointer rounded-md px-3 py-1.5 text-[11px] font-bold transition-colors ${
                chartRange === r
                  ? 'bg-surface-600 text-text-primary shadow-sm'
                  : 'text-text-secondary hover:bg-surface-600/50 hover:text-text-primary'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart container */}
      <div className="rounded-2xl bg-surface-700/20 p-4 md:p-6">
        <div className="mb-6 flex items-center justify-between text-[11px] font-semibold tracking-wider text-text-secondary uppercase">
          <span className="text-text-primary text-sm">{base}/{target}</span>
          {stats && <span>{formatRate(stats.last)} · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>}
        </div>

        {loading && (
          <div className="flex h-[280px] items-center justify-center text-sm text-text-secondary">
            Loading chart...
          </div>
        )}

        {error && (
          <div className="flex h-[280px] flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-text-primary">No chart data available</p>
            <p className="mt-1 text-xs text-text-secondary">
              We couldn't load rate history for {base}/{target} right now.
            </p>
          </div>
        )}

        {!loading && !error && points.length > 0 && (
          <div className="h-[280px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-text-tertiary">{label}</p>
      <p className={`font-mono text-xl font-medium ${positive === true ? 'text-positive' : positive === false ? 'text-negative' : 'text-text-primary'}`}>
        {value}
      </p>
    </div>
  )
}
