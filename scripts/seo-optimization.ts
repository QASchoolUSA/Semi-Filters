import { createClient } from 'next-sanity'
import { readFileSync } from 'fs'
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

interface ProductSeo {
    name: string
    slug: string
    seoTitle: string
    seoDescription: string
}

const seoData: Record<string, ProductSeo> = {

    // ── Oil Filters ──────────────────────────────────────────────

    'product-21707132': {
        name: 'Volvo 21707132 Bypass Oil Filter — D11, D12, D13 Engines',
        slug: 'volvo-21707132-bypass-oil-filter',
        seoTitle: 'Volvo 21707132 Bypass Oil Filter for VNL D11 D12 D13',
        seoDescription:
            'Shop the Volvo 21707132 bypass oil filter for VNL, VNM & VHD trucks with D11–D13 engines. OEM-quality filtration, fast shipping. Replaces Baldwin B7409, Donaldson P550425.',
    },

    'product-23151592': {
        name: 'Volvo 23151592 Full-Flow Oil Filter — D11, D12, D13 Engines',
        slug: 'volvo-23151592-oil-filter',
        seoTitle: 'Volvo 23151592 Oil Filter for VNL D11 D12 D13',
        seoDescription:
            'Buy the Volvo 23151592 full-flow oil filter for VNL, VNM & VHD trucks. Premium filtration media, OEM fit. Fast shipping. Replaces Baldwin B40153, Fleetguard LF16465.',
    },

    'product-23658092': {
        name: 'Volvo 23658092 Long Life Oil Filter — D11, D12, D13, D16 Engines',
        slug: 'volvo-23658092-long-life-oil-filter',
        seoTitle: 'Volvo 23658092 Long Life Oil Filter for VNL D12 D13',
        seoDescription:
            'Shop the Volvo 23658092 extended-life oil filter for D11–D16 diesel engines. Fits VNL, VNM & VHD trucks. Fast shipping. Replaces Fleetguard LF3675, Donaldson P550519.',
    },

    // ── Fuel Filters ─────────────────────────────────────────────

    'product-23920469': {
        name: 'Volvo 23920469 Secondary Fuel Filter — D11, D13 Engines',
        slug: 'volvo-23920469-fuel-filter',
        seoTitle: 'Volvo 23920469 Fuel Filter for VNL D11 D13',
        seoDescription:
            'Buy the Volvo 23920469 secondary fuel filter for VNL & VHD trucks with D11/D13 engines. 99.9% efficiency, OEM quality. Fast shipping. Replaces Baldwin BF46117.',
    },

    'product-fs19764': {
        name: 'FS19764 Fuel Water Separator — Volvo & Mack Heavy-Duty Diesel',
        slug: 'fs19764-volvo-mack-fuel-water-separator',
        seoTitle: 'FS19764 Fuel Water Separator for Volvo & Mack Trucks',
        seoDescription:
            'Shop the FS19764 fuel water separator with StrataPore media. Fits Volvo & Mack trucks with Davco Fuel Pro systems. Fast shipping. Replaces Baldwin PF9814, WIX 33964.',
    },

    'product-fs19765': {
        name: 'FS19765 Fuel Water Separator — Kenworth & Peterbilt Diesel',
        slug: 'fs19765-kenworth-fuel-water-separator',
        seoTitle: 'FS19765 Fuel Water Separator for Kenworth Trucks',
        seoDescription:
            'Buy the FS19765 fuel water separator. 95% water separation, biodiesel compatible. Fits Diesel Pro & Fuel Pro systems. Fast shipping. Replaces Baldwin PF7930, Donaldson P550851.',
    },

    'product-fs19915': {
        name: 'FS19915 Fuel Filter with Water Separator — Freightliner DD15',
        slug: 'fs19915-freightliner-fuel-water-separator',
        seoTitle: 'FS19915 Fuel Water Separator for Freightliner Cascadia',
        seoDescription:
            'Shop the FS19915 fuel filter with water separator for Freightliner Cascadia & Columbia with Detroit DD15 engines. 98% water separation. Replaces Baldwin PF9804, WIX 33655.',
    },

    'product-fs20313': {
        name: 'FS20313 Fuel Water Separator — Volvo D11, D13 & Mack MP7, MP8',
        slug: 'fs20313-volvo-mack-fuel-water-separator',
        seoTitle: 'FS20313 Fuel Water Separator for Volvo D13 & Mack MP8',
        seoDescription:
            'Buy the FS20313 EleMax fuel water separator for Volvo VNL (D11/D13) and Mack Anthem/Pinnacle (MP7/MP8) trucks. Three-stage water removal. Fast shipping.',
    },

    // ── Air Filters ──────────────────────────────────────────────

    'product-03-42776-010': {
        name: '03-42776-010 Air Filter — Freightliner Cascadia (2018+)',
        slug: '03-42776-010-freightliner-cascadia-air-filter',
        seoTitle: '03-42776-010 Air Filter for Freightliner Cascadia',
        seoDescription:
            'Shop the 03-42776-010 engine air filter for 2018+ Freightliner Cascadia trucks. Fits Cummins X15 & Detroit DD15. Premium filtration media. Replaces Donaldson P628541.',
    },

    'product-21715813': {
        name: 'Volvo 21715813 Primary Air Filter — VNL, VNM, VNR, VHD',
        slug: 'volvo-21715813-air-filter',
        seoTitle: 'Volvo 21715813 Air Filter for VNL VNM VNR VHD',
        seoDescription:
            'Buy the Volvo 21715813 primary engine air filter for VNL, VNM, VNR & VHD trucks. 99% filtration efficiency, expanded cage support. Replaces Baldwin RS4642, WIX 49126.',
    },

    'product-af26163m': {
        name: 'AF26163M Air Filter for Volvo VNL — Replaces 20411815',
        slug: 'af26163m-volvo-vnl-air-filter',
        seoTitle: 'AF26163M Air Filter for Volvo VNL VNM VHD',
        seoDescription:
            'Shop the AF26163M primary air filter for Volvo VNL, VNM, VHD & VAH trucks. Direct replacement for 20411815. Fast shipping. Replaces Baldwin RS4642, WIX 49126, Donaldson P606720.',
    },

    'product-af27879': {
        name: 'AF27879 Air Filter for Freightliner Cascadia & Columbia',
        slug: 'af27879-freightliner-air-filter',
        seoTitle: 'AF27879 Air Filter for Freightliner Cascadia',
        seoDescription:
            'Buy the AF27879 engine air filter for Freightliner Cascadia, Columbia & Century trucks. OEM-quality panel element. Fast shipping. Replaces Baldwin CA5790, WIX 49478.',
    },

    'product-d371061': {
        name: 'D371061 Air Filter for Kenworth T680 & Peterbilt 579 (2022+)',
        slug: 'd371061-kenworth-peterbilt-air-filter',
        seoTitle: 'D371061 Air Filter for Kenworth T680 & Peterbilt 579',
        seoDescription:
            'Shop the D371061 Paccar OEM engine air filter for 2022+ Kenworth T680, T880 & Peterbilt 579 trucks. Premium glass fiber media. Fast shipping. Replaces Donaldson DBA6329.',
    },

    'product-p611696': {
        name: 'P611696 Air Filter for Kenworth T680, T800, T880, W900',
        slug: 'p611696-kenworth-air-filter',
        seoTitle: 'P611696 Air Filter for Kenworth T680 T800 W900',
        seoDescription:
            'Buy the P611696 engine air filter for Kenworth T680, T800, T880 & W900 trucks. Fits Paccar MX-13 & Cummins ISX engines. Fast shipping. Replaces Fleetguard AF27688, WIX 49456.',
    },

    'product-p621725': {
        name: 'P621725 PowerCore Air Filter for Kenworth T680 & Peterbilt 579',
        slug: 'p621725-kenworth-peterbilt-air-filter',
        seoTitle: 'P621725 PowerCore Air Filter for Kenworth & Peterbilt',
        seoDescription:
            'Shop the P621725 PowerCore G2 air filter for Kenworth T680, T880 & Peterbilt 567, 579 trucks. Advanced fluted media technology. Fast shipping. Replaces Baldwin PA32000.',
    },

    // ── Kits ─────────────────────────────────────────────────────

    'product-kit--1': {
        name: 'Volvo VNL D13 Engine Filter Kit — 21707132, 23658092, 23920469',
        slug: 'volvo-vnl-d13-engine-filter-kit',
        seoTitle: 'Volvo VNL D13 Engine Filter Kit — Oil & Fuel Filters',
        seoDescription:
            'Complete engine filter kit for Volvo VNL D12/D13 trucks. Includes bypass oil filter 21707132, 2× oil filters 23658092 & fuel filter 23920469. Save vs buying separately.',
    },

    'product-kit--2': {
        name: 'Volvo VNL D13 Fuel & Oil Filter Change Kit — FS20313, 23920469, 23151592',
        slug: 'volvo-vnl-fuel-oil-filter-change-kit',
        seoTitle: 'Volvo VNL D13 Fuel & Oil Filter Change Kit',
        seoDescription:
            'Fuel & oil filter change kit for Volvo VNL D12/D13 trucks. Includes 2× oil filters 23151592, fuel filter 23920469 & fuel water separator FS20313. Bundle pricing.',
    },

    'product-kit--3': {
        name: 'Volvo VNL D13 Oil Filter Change Kit — 21707132, 23658092',
        slug: 'volvo-vnl-oil-filter-change-kit',
        seoTitle: 'Volvo VNL D12 D13 Oil Filter Change Kit',
        seoDescription:
            'Oil filter change kit for Volvo VNL D12/D13 trucks. Includes bypass filter 21707132 & 2× long-life filters 23658092. Complete two-stage oil filtration. Bundle pricing.',
    },

    'product-kit--4': {
        name: 'Volvo VNL Complete Engine Filter Kit — Oil, Fuel & Water Separator',
        slug: 'volvo-vnl-complete-engine-filter-kit',
        seoTitle: 'Volvo VNL D12 D13 Complete Engine Filter Kit',
        seoDescription:
            'Complete filter maintenance kit for Volvo VNL D12/D13 trucks. Includes bypass oil filter, oil filters, fuel filter & water separator. 4 filters, 1 kit, full protection.',
    },

    'product-kit--5': {
        name: 'Volvo VNL Fuel & Oil Service Kit — FS20313, 23151592',
        slug: 'volvo-vnl-fuel-oil-service-kit',
        seoTitle: 'Volvo VNL Fuel & Oil Service Kit — FS20313',
        seoDescription:
            'Fuel & oil service kit for Volvo VNL D12/D13 trucks. Includes 2× oil filters 23151592 & EleMax fuel water separator FS20313. Convenient bundle pricing. Fast shipping.',
    },

    'product-kit--6': {
        name: 'Volvo VNL Fuel & Oil Filter Kit — 23920469, 23151592',
        slug: 'volvo-vnl-d13-fuel-oil-filter-kit',
        seoTitle: 'Volvo VNL D13 Fuel & Oil Filter Kit',
        seoDescription:
            'Fuel & oil filter kit for Volvo VNL D11/D12/D13 trucks. Includes 2× oil filters 23151592 & fuel filter 23920469. Brand new in original packaging. Fast shipping.',
    },

    // ── LED Lamps ────────────────────────────────────────────────

    'product-red-lamp': {
        name: '60250R Red LED Stop/Turn/Tail Truck Lamp — Oval, DOT Compliant',
        slug: '60250r-red-led-truck-lamp',
        seoTitle: '60250R Red LED Stop Turn Tail Truck Lamp',
        seoDescription:
            'Shop the 60250R red LED oval stop/turn/tail lamp. 26 LEDs, DOT & SAE compliant, sealed construction. Fits Volvo, Freightliner, Kenworth trucks. Fast shipping.',
    },

    'product-white-lamp': {
        name: '6060C White LED Backup Truck Lamp — Oval, 24-Diode Array',
        slug: '6060c-white-led-truck-backup-lamp',
        seoTitle: '6060C White LED Truck Backup Lamp — Oval',
        seoDescription:
            'Buy the 6060C white LED oval backup lamp. 24-diode full-pattern array, epoxy-sealed, shock resistant. Fits Volvo, Freightliner, Kenworth trucks. Fast shipping.',
    },
}

async function main() {
    const products: { _id: string; name: string; slug: { current: string } }[] =
        await client.fetch(`*[_type == "product"] { _id, name, "slug": slug }`)

    console.log(`Found ${products.length} products. Starting SEO optimization...\n`)

    let updated = 0
    let skipped = 0

    for (const product of products) {
        const data = seoData[product._id]
        if (!data) {
            console.log(`⏭  No SEO data for ${product._id} (${product.name}) — skipping`)
            skipped++
            continue
        }

        const patch: Record<string, unknown> = {}

        if (product.name !== data.name) patch.name = data.name
        if (product.slug?.current !== data.slug)
            patch.slug = { _type: 'slug', current: data.slug }
        patch.seoTitle = data.seoTitle
        patch.seoDescription = data.seoDescription

        if (Object.keys(patch).length === 0) {
            console.log(`✓  ${product._id} already up to date`)
            skipped++
            continue
        }

        await client.patch(product._id).set(patch).commit()
        const changes = Object.keys(patch).join(', ')
        console.log(`✅ ${product._id}: updated ${changes}`)
        console.log(`   Name: ${data.name}`)
        console.log(`   Slug: /shop/${data.slug}`)
        console.log(`   Title: ${data.seoTitle} | Semi Filters`)
        console.log(`   Desc:  ${data.seoDescription.slice(0, 80)}...\n`)
        updated++
    }

    console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`)
}

main().catch(console.error)
