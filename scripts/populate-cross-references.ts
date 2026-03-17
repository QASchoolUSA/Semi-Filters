/**
 * Migration script: Populates crossReferences field for all filter products.
 *
 * Usage:
 *   npx tsx scripts/populate-cross-references.ts
 *
 * Requires NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and
 * SANITY_API_TOKEN environment variables (loaded from .env.local automatically).
 */

import { createClient } from 'next-sanity'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local without requiring dotenv as a dependency
const envPath = resolve(process.cwd(), '.env.local')
try {
    const envContent = readFileSync(envPath, 'utf-8')
    for (const line of envContent.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const eqIdx = trimmed.indexOf('=')
        if (eqIdx === -1) continue
        const key = trimmed.slice(0, eqIdx).trim()
        const value = trimmed.slice(eqIdx + 1).trim()
        if (!process.env[key]) {
            process.env[key] = value
        }
    }
} catch {
    console.warn('Could not read .env.local — make sure env vars are set')
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2025-03-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN!,
})

const crossReferenceData: Record<string, string[]> = {
    '03-42776-010': [
        'P628541', '03-42086-010', '831.466010',
    ],
    '21707132': [
        'P550425', 'B7409', 'WL10173', 'WL10106', '51660',
        'LF3654', 'LF17502', 'LFP8642',
        '20843764', '20845764', '1660', 'P9407',
    ],
    '21715813': [
        'RS4642', '49126', 'P606720',
        'CA9901', 'LAF9201', 'E767L', 'AF2414', '83126',
    ],
    '23151592': [
        'LF16465', 'B40153', 'P582021', 'WL10651',
        '23155587', 'LFP3247', '400651', 'W11020',
    ],
    '23658092': [
        'LF3675', 'LF17503', '51791XD', 'P550519',
        'W11025', 'H200W40', 'OC370', '2170133', '478736',
    ],
    '23920469': [
        'BF46117', 'FF42128NN', 'DBF5967', 'LFH22005', '600447',
    ],
    'AF26163M': [
        'RS4642', '49126', 'P605551', 'P606720',
        'CA9901', 'LAF9201', '9126', '83126',
        'LX1600', 'E767L', 'C331630',
    ],
    'AF27879': [
        'CA5790', '49478', 'P610260', 'P618478',
        'LAF6260', 'CA11249', '83478',
    ],
    'FS19764': [
        'PF9814', '33964', 'P550849', 'P179960',
        'L9763FXL', '3964', '86964', 'FF1216', 'CS11023',
    ],
    'FS19765': [
        'PF7930', 'P550851', 'P568522',
        '102528', '102761', '382136',
    ],
    'FS19915': [
        'PF9804', '33655', 'P551011',
        'L9915F', '3655', '86655', 'CS11122',
    ],
    'FS20313': [
        '24009058', '24009059',
    ],
    'D371061': [
        'DBA6329', 'D37-1061', 'D37-1037',
    ],
    'P611696': [
        '49456', 'AF27688', '9456',
        'LAF6116', 'CA10738', '83456',
    ],
    'P621725': [
        'PA32000', 'WA11058',
    ],
}

async function main() {
    console.log('Fetching products from Sanity...')

    const products: { _id: string; partNumber: string }[] = await client.fetch(
        `*[_type == "product" && defined(partNumber)] { _id, partNumber }`
    )

    console.log(`Found ${products.length} products with part numbers.\n`)

    let updated = 0
    let skipped = 0

    for (const product of products) {
        const refs = crossReferenceData[product.partNumber]
        if (!refs) {
            console.log(`  SKIP  ${product.partNumber} — no cross-reference data`)
            skipped++
            continue
        }

        console.log(`  PATCH ${product.partNumber} — ${refs.length} cross-references`)
        await client
            .patch(product._id)
            .set({ crossReferences: refs })
            .commit()
        updated++
    }

    console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`)
}

main().catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
})
