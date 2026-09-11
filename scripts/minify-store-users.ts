/**
 * Minify STORE_MANAGEMENT_USERS JSON to a single line for .env / Vercel.
 *
 * Usage:
 *   npx tsx scripts/minify-store-users.ts
 *   # paste JSON, then Ctrl+D (mac/linux) or Ctrl+Z Enter (windows)
 *
 *   npx tsx scripts/minify-store-users.ts path/to/users.json
 *
 *   echo '[{"email":"...","passwordHash":"...","name":"Admin"}]' | npx tsx scripts/minify-store-users.ts
 */
import { readFileSync } from 'fs'

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks).toString('utf8')
}

async function main() {
  const filePath = process.argv[2]
  const raw = filePath
    ? readFileSync(filePath, 'utf8')
    : process.stdin.isTTY
      ? ''
      : await readStdin()

  if (!raw.trim()) {
    console.error(`Usage:
  npx tsx scripts/minify-store-users.ts users.json
  npx tsx scripts/minify-store-users.ts < users.json
  echo '[...]' | npx tsx scripts/minify-store-users.ts`)
    process.exit(1)
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    console.error('Invalid JSON')
    process.exit(1)
  }

  const oneLine = JSON.stringify(parsed)
  console.log(oneLine)
  console.log('\n# Paste into .env.local / Vercel as:')
  console.log(`STORE_MANAGEMENT_USERS='${oneLine}'`)
}

main()
