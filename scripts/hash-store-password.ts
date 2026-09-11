/**
 * Generate a bcrypt hash for STORE_MANAGEMENT_USERS.
 *
 * Usage:
 *   npx tsx scripts/hash-store-password.ts 'your-password'
 */
import bcrypt from 'bcryptjs'

const password = process.argv[2]
if (!password) {
  console.error('Usage: npx tsx scripts/hash-store-password.ts <password>')
  process.exit(1)
}

const hash = bcrypt.hashSync(password, 12)
const email = process.argv[3] || 'you@semifilters.com'
const name = process.argv[4] || 'Admin'
const users = [{ email, passwordHash: hash, name }]
const oneLine = JSON.stringify(users)

console.log(hash)
console.log('\nOne-line STORE_MANAGEMENT_USERS (copy this):')
console.log(oneLine)
console.log('\n.env.local / Vercel:')
console.log(`STORE_MANAGEMENT_USERS='${oneLine}'`)
