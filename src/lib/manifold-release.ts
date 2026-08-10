/**
 * Single source of truth for the Manifold version and download links.
 *
 * The version lives in the app, not here: this reads the latest *published
 * release* of vippsas/manifold from the GitHub API at build time. Nothing in
 * this repository needs bumping when the app releases.
 *
 * Why the release rather than the app's `package.json` on `main`: the page
 * builds `.dmg` download URLs from this value, and `main` can run ahead of the
 * newest published release — which would produce 404 download links. The
 * release is the thing a visitor can actually download. The asset URLs are read
 * straight from the API response rather than being reconstructed from a
 * filename convention, so a change to how assets are named can't silently break
 * the buttons.
 *
 * This is a BUILD-TIME fetch. The output is static HTML, so a visitor's browser
 * never contacts GitHub and the site keeps its zero-third-party-request
 * property. Do not move this call into client-side script.
 */
import pkg from '../../package.json'

const REPO = 'vippsas/manifold'
const RELEASES_URL = `https://github.com/${REPO}/releases`
const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`

export interface ManifoldRelease {
  /** Bare version, e.g. "0.2.109". */
  version: string
  /** Release tag, e.g. "v0.2.109". */
  tag: string
  /** Apple Silicon disk image. */
  armDmg: string
  /** Intel disk image. */
  intelDmg: string
  releasesUrl: string
  /** Where the value came from — 'fallback' means the API was unreachable. */
  source: 'github' | 'fallback'
}

/**
 * Download URLs derived from the naming convention electron-builder produces.
 * Only used when the API is unreachable; the happy path reads real asset URLs.
 */
function conventionalUrls(version: string) {
  const base = `${RELEASES_URL}/download/v${version}`
  return {
    armDmg: `${base}/Manifold-${version}-arm64.dmg`,
    intelDmg: `${base}/Manifold-${version}.dmg`,
  }
}

/**
 * `process.env` without pulling in @types/node for a single lookup. An
 * authenticated request raises the rate limit from 60/hr to 5000/hr, which
 * matters on shared CI egress IPs. Unauthenticated still works.
 */
function githubToken(): string | undefined {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
  return env?.GITHUB_TOKEN ?? env?.GH_TOKEN
}

async function resolveRelease(): Promise<ManifoldRelease> {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      // GitHub rejects API requests without one.
      'User-Agent': 'manifold-landingpage-build',
    }
    const token = githubToken()
    if (token) headers.Authorization = `Bearer ${token}`

    const res = await fetch(API_URL, { headers })
    if (!res.ok) throw new Error(`GitHub API returned ${res.status} ${res.statusText}`)

    const data = (await res.json()) as {
      tag_name?: string
      assets?: { name: string; browser_download_url: string }[]
    }
    const tag = data.tag_name
    if (!tag) throw new Error('release payload had no tag_name')
    const version = tag.replace(/^v/, '')

    // `.dmg.blockmap` assets also exist, so match the exact extension.
    const dmgs = (data.assets ?? []).filter((a) => a.name.endsWith('.dmg'))
    const arm = dmgs.find((a) => a.name.includes('-arm64'))
    const intel = dmgs.find((a) => !a.name.includes('-arm64'))
    const fallbackUrls = conventionalUrls(version)

    if (!arm || !intel) {
      console.warn(
        `[manifold-release] ${tag} did not expose both disk images (arm64: ${Boolean(arm)}, intel: ${Boolean(intel)}); using conventional URLs for the missing one.`,
      )
    }

    return {
      version,
      tag,
      armDmg: arm?.browser_download_url ?? fallbackUrls.armDmg,
      intelDmg: intel?.browser_download_url ?? fallbackUrls.intelDmg,
      releasesUrl: RELEASES_URL,
      source: 'github',
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    // Deliberately non-fatal: an offline build should still produce a working
    // site. The links point at the last release this repo knew about, which
    // exists, so they resolve — they are just not the newest.
    console.warn(
      `[manifold-release] could not read the latest release of ${REPO} (${reason}). ` +
        `Falling back to ${pkg.version} from package.json — download links will point at that release.`,
    )
    return {
      version: pkg.version,
      tag: `v${pkg.version}`,
      ...conventionalUrls(pkg.version),
      releasesUrl: RELEASES_URL,
      source: 'fallback',
    }
  }
}

// Resolved once per build, however many components ask for it.
let cached: Promise<ManifoldRelease> | null = null

export function getManifoldRelease(): Promise<ManifoldRelease> {
  cached ??= resolveRelease()
  return cached
}
