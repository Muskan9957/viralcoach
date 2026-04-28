// ─── IP-based region detection ────────────────────────────────────
// Uses ipapi.co free tier (1000 req/day) — no API key needed.
// Runs once on first use, result saved to localStorage forever.

const COUNTRY_TO_REGION = {
  // India
  IN: 'India',
  // United States / Canada
  US: 'US', CA: 'US',
  // United Kingdom / Ireland
  GB: 'UK', IE: 'UK',
  // Middle East
  AE: 'Middle East', SA: 'Middle East', KW: 'Middle East',
  QA: 'Middle East', BH: 'Middle East', OM: 'Middle East',
  EG: 'Middle East', JO: 'Middle East', LB: 'Middle East',
  // Southeast Asia
  ID: 'Southeast Asia', MY: 'Southeast Asia', PH: 'Southeast Asia',
  TH: 'Southeast Asia', VN: 'Southeast Asia', SG: 'Southeast Asia',
  MM: 'Southeast Asia', KH: 'Southeast Asia',
}

const STORAGE_KEY = 'arc_audience'

export async function detectAndSaveRegion() {
  // Already set — don't overwrite user's choice
  if (localStorage.getItem(STORAGE_KEY)) return localStorage.getItem(STORAGE_KEY)

  try {
    const res  = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) })
    const data = await res.json()
    const region = COUNTRY_TO_REGION[data.country_code] || 'Global'
    localStorage.setItem(STORAGE_KEY, region)
    return region
  } catch {
    // Detection failed silently — leave blank so user sets manually
    return null
  }
}

export function getSavedRegion() {
  return localStorage.getItem(STORAGE_KEY) || ''
}

export function saveRegion(region) {
  localStorage.setItem(STORAGE_KEY, region)
}

export const REGIONS = [
  { value: 'India',          label: '🇮🇳 India'          },
  { value: 'Global',         label: '🌐 Global'          },
  { value: 'US',             label: '🇺🇸 United States'  },
  { value: 'UK',             label: '🇬🇧 United Kingdom' },
  { value: 'Middle East',    label: '🇦🇪 Middle East'    },
  { value: 'Southeast Asia', label: '🌏 Southeast Asia'  },
]
