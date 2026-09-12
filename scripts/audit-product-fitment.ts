/**
 * Audit all products for description vs vehicleFit / SEO / specs mismatches.
 *
 * Usage:
 *   npx tsx scripts/audit-product-fitment.ts
 */

import { createClient } from 'next-sanity'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

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
        if (!process.env[key]) process.env[key] = value
    }
} catch {}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2025-03-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN!,
})

const BRANDS = [
    'Volvo',
    'Freightliner',
    'Kenworth',
    'Peterbilt',
    'Mack',
    'International',
    'Western Star',
    'DAF',
] as const

type PortableChild = { text?: string }
type PortableBlock = { children?: PortableChild[] }

function blocksToText(blocks: PortableBlock[] | null | undefined): string {
    if (!blocks?.length) return ''
    return blocks
        .map((b) => (b.children ?? []).map((c) => c.text ?? '').join(''))
        .join('\n')
}

function findBrands(text: string): string[] {
    const lower = text.toLowerCase()
    return BRANDS.filter((b) => lower.includes(b.toLowerCase()))
}

interface ProductRow {
    _id: string
    name: string | null
    partNumber: string | null
    vehicleFit: string[] | null
    crossReferences: string[] | null
    seoTitle: string | null
    seoDescription: string | null
    specifications: { label?: string; value?: string }[] | null
    description: PortableBlock[] | null
    slug: { current?: string } | null
    brand: string | null
    productType: string | null
    category: { name?: string; slug?: { current?: string } } | null
}

async function main() {
    const products = await client.fetch<ProductRow[]>(`*[_type == "product"] | order(partNumber asc) {
    _id,
    name,
    partNumber,
    vehicleFit,
    crossReferences,
    seoTitle,
    seoDescription,
    specifications,
    description,
    slug,
    brand,
    productType,
    category->{name, slug}
  }`)

    const scorecard = products.map((p) => {
        const descText = blocksToText(p.description)
        const combined = [p.name, p.seoTitle, p.seoDescription, descText].filter(Boolean).join('\n')
        const mentioned = findBrands(combined)
        const tags = p.vehicleFit ?? []
        const missingFromTags = mentioned.filter((b) => !tags.includes(b))
        const tagsNotInCopy = tags.filter((b) => !mentioned.includes(b))
        const hasSpecProse =
            /\b(\d+(\.\d+)?\s?(mm|in|inch|inches|micron|gpm|psi|od|id)|height|diameter|gasket)\b/i.test(
                descText
            )
        const specsEmpty = !p.specifications?.length

        return {
            _id: p._id,
            partNumber: p.partNumber,
            name: p.name,
            slug: p.slug?.current,
            category: p.category?.name,
            productType: p.productType,
            vehicleFit: tags,
            brandsInCopy: mentioned,
            missingFromVehicleFit: missingFromTags,
            vehicleFitNotInCopy: tagsNotInCopy,
            crossReferences: p.crossReferences ?? [],
            specsCount: p.specifications?.length ?? 0,
            specsEmptyButProseHasDims: specsEmpty && hasSpecProse,
            seoTitle: p.seoTitle,
            seoDescription: p.seoDescription,
            descriptionPreview: descText.slice(0, 280),
        }
    })

    const summary = {
        total: scorecard.length,
        withVehicleFitGaps: scorecard.filter((r) => r.missingFromVehicleFit.length > 0).length,
        withOrphanTags: scorecard.filter((r) => r.vehicleFitNotInCopy.length > 0).length,
        withSparseSpecs: scorecard.filter((r) => r.specsEmptyButProseHasDims).length,
        rows: scorecard,
    }

    const outPath = resolve(process.cwd(), 'scripts/audit-product-fitment-report.json')
    writeFileSync(outPath, JSON.stringify(summary, null, 2))
    console.log(`Audited ${summary.total} products`)
    console.log(`  vehicleFit gaps: ${summary.withVehicleFitGaps}`)
    console.log(`  orphan vehicleFit tags: ${summary.withOrphanTags}`)
    console.log(`  sparse specs (dims in prose): ${summary.withSparseSpecs}`)
    console.log(`Wrote ${outPath}`)

    for (const row of scorecard) {
        if (
            row.missingFromVehicleFit.length ||
            row.vehicleFitNotInCopy.length ||
            row.specsEmptyButProseHasDims
        ) {
            console.log(
                `\n${row.partNumber || row._id}: missingTags=[${row.missingFromVehicleFit}] orphanTags=[${row.vehicleFitNotInCopy}] sparseSpecs=${row.specsEmptyButProseHasDims}`
            )
        }
    }
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
