import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { MILESTONE } from './milestone'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as { version: string }

function readGitCommit(): string {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return process.env['GIT_COMMIT'] ?? 'unknown'
  }
}

export const defines = {
  __MILESTONE__: JSON.stringify(MILESTONE),
  __APP_VERSION__: JSON.stringify(pkg.version),
  __GIT_COMMIT__: JSON.stringify(readGitCommit()),
}
