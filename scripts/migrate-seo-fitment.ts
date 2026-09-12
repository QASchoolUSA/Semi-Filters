/**
 * Migrates all products: vehicleFit, fitmentDetails, FAQs, SEO accuracy fixes,
 * and sparse specifications. Also seeds category SEO + 8 guides.
 *
 * Usage: node --import tsx scripts/migrate-seo-fitment.ts
 */

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
} catch {
    console.warn('Could not read .env.local')
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2025-03-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN!,
})

let keyCounter = 0
function uid(prefix = 'k'): string {
    return `${prefix}_${Date.now()}_${++keyCounter}`
}

type Fitment = {
    brand: string
    models?: string[]
    engines?: string[]
    notes?: string
}

type Faq = { question: string; answer: string }

type Spec = { label: string; value: string }

type Block = {
    _key: string
    _type: 'block'
    children: { _key: string; _type: 'span'; marks: string[]; text: string }[]
    markDefs: never[]
    style: string
    level?: number
    listItem?: string
}

function p(text: string): Block {
    return {
        _key: uid('b'),
        _type: 'block',
        style: 'normal',
        markDefs: [],
        children: [{ _key: uid('s'), _type: 'span', marks: [], text }],
    }
}

function h(text: string, style: 'h2' | 'h3' = 'h2'): Block {
    return {
        _key: uid('b'),
        _type: 'block',
        style,
        markDefs: [],
        children: [{ _key: uid('s'), _type: 'span', marks: [], text }],
    }
}

function li(text: string): Block {
    return {
        _key: uid('b'),
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        markDefs: [],
        children: [{ _key: uid('s'), _type: 'span', marks: [], text }],
    }
}

function withKeys<T extends Record<string, unknown>>(items: T[]): (T & { _key: string })[] {
    return items.map((item) => ({ ...item, _key: uid('fk') }))
}

function verifyNote(part: string): string {
    return `Always confirm ${part} against your OEM filter list, VIN build sheet, or existing housing stamp before install.`
}

function baseFaqs(part: string, fitSummary: string, crossHint?: string): Faq[] {
    const faqs: Faq[] = [
        {
            question: `Will ${part} fit my truck?`,
            answer: `${fitSummary} ${verifyNote(part)}`,
        },
        {
            question: `Is ${part} OEM quality?`,
            answer: `Yes. Semi Filters stocks OEM-specification filtration that meets or exceeds the filtration efficiency and fit of the factory part for listed applications.`,
        },
        {
            question: 'How fast do you ship?',
            answer:
                'Orders placed before 2 PM typically ship same day. Standard US delivery is 2–5 business days. Free shipping is available on orders over $150.',
        },
    ]
    if (crossHint) {
        faqs.splice(1, 0, {
            question: `What does ${part} cross-reference to?`,
            answer: crossHint,
        })
    }
    return faqs
}

type ProductPatch = {
    vehicleFit?: string[]
    fitmentDetails?: Fitment[]
    faqs?: Faq[]
    specifications?: Spec[]
    seoTitle?: string
    seoDescription?: string
    name?: string
    description?: Block[]
}

const patches: Record<string, ProductPatch> = {
    'product-21707132': {
        vehicleFit: ['Volvo', 'Mack'],
        fitmentDetails: [
            {
                brand: 'Volvo',
                models: ['VNL', 'VNM', 'VHD', 'VNX'],
                engines: ['D11', 'D12', 'D13'],
                notes: 'Bypass / secondary oil filtration stage',
            },
            {
                brand: 'Mack',
                engines: ['MP7', 'MP8'],
                notes: 'Shared platform applications; confirm OEM # 20843764 / 20845764',
            },
        ],
        specifications: [
            { label: 'Filter Type', value: 'Bypass oil filter' },
            { label: 'OEM Part Number', value: '21707132' },
            { label: 'Common Cross-Refs', value: 'Baldwin B7409, Donaldson P550425, Fleetguard LF3654' },
        ],
        faqs: baseFaqs(
            '21707132',
            'Listed for Volvo D11/D12/D13 applications (VNL/VNM/VHD/VNX) and shared Mack MP7/MP8 platforms where OEM lists 21707132 or Mack 20843764/20845764.',
            'Common interchanges include Baldwin B7409, Donaldson P550425, Fleetguard LF3654/LF17502, and Mack 20843764/20845764.'
        ),
        seoDescription:
            'Volvo 21707132 bypass oil filter for VNL/VNM/VHD with D11–D13 engines. Also used on shared Mack MP7/MP8 apps. Replaces Baldwin B7409, Donaldson P550425.',
    },
    'product-23151592': {
        vehicleFit: ['Volvo', 'Mack'],
        fitmentDetails: [
            {
                brand: 'Volvo',
                models: ['VNL', 'VNM', 'VHD'],
                engines: ['D11', 'D12', 'D13'],
                notes: 'Full-flow primary oil filter',
            },
            {
                brand: 'Mack',
                engines: ['MP7', 'MP8'],
                notes: 'Shared Volvo/Mack platform applications — verify OEM list',
            },
        ],
        specifications: [
            { label: 'Filter Type', value: 'Full-flow oil filter' },
            { label: 'OEM Part Number', value: '23151592' },
            { label: 'Common Cross-Refs', value: 'Fleetguard LF16465, Baldwin B40153, Donaldson P582021' },
        ],
        faqs: baseFaqs(
            '23151592',
            'Listed for Volvo D11/D12/D13 trucks and shared Mack applications where the OEM oil filter number matches 23151592.',
            'Common interchanges include Fleetguard LF16465, Baldwin B40153, and Donaldson P582021.'
        ),
    },
    'product-23658092': {
        vehicleFit: ['Volvo'],
        fitmentDetails: [
            {
                brand: 'Volvo',
                models: ['VNL', 'VNM', 'VHD'],
                engines: ['D11', 'D12', 'D13', 'D16'],
                notes: 'Extended-life / long-life oil filter applications',
            },
        ],
        faqs: baseFaqs(
            '23658092',
            'Listed for Volvo D11–D16 heavy-duty platforms including VNL, VNM, and VHD where OEM specifies 23658092.',
            'Common interchanges include Fleetguard LF3675/LF17503 and Donaldson P550519.'
        ),
    },
    'product-23920469': {
        vehicleFit: ['Volvo'],
        fitmentDetails: [
            {
                brand: 'Volvo',
                models: ['VNL', 'VHD'],
                engines: ['D11', 'D13'],
                notes: 'Secondary fuel filter',
            },
        ],
        specifications: [
            { label: 'Filter Type', value: 'Secondary fuel filter' },
            { label: 'OEM Part Number', value: '23920469' },
            { label: 'Common Cross-Refs', value: 'Baldwin BF46117, Fleetguard FF42128NN' },
        ],
        faqs: baseFaqs(
            '23920469',
            'Listed for Volvo D11/D13 secondary fuel filtration on VNL and VHD applications that call for 23920469.',
            'Common interchanges include Baldwin BF46117 and Fleetguard FF42128NN.'
        ),
    },
    'product-24137737': {
        vehicleFit: ['Volvo', 'Mack'],
        fitmentDetails: [
            {
                brand: 'Volvo',
                engines: ['D13'],
                notes: '2024+ D13 secondary fuel filter',
            },
            {
                brand: 'Mack',
                engines: ['MP8'],
                notes: 'Shared late-model MP8 applications — verify OEM',
            },
        ],
        faqs: baseFaqs(
            '24137737',
            'Listed for 2024+ Volvo D13 and Mack MP8 secondary fuel applications that specify 24137737 (or OEM crosses 24137493 / 24470880).',
            'Crosses Volvo/Mack numbers 24137493 and 24470880 on many late-model builds.'
        ),
    },
    'product-fs19764': {
        vehicleFit: ['Volvo', 'Mack'],
        fitmentDetails: [
            {
                brand: 'Volvo',
                notes: 'Davco Fuel Pro / Diesel Pro style housings — confirm element length',
            },
            {
                brand: 'Mack',
                notes: 'Davco Fuel Pro systems on Mack heavy-duty diesels — confirm housing stamp',
            },
        ],
        faqs: baseFaqs(
            'FS19764',
            'Designed for Davco Fuel Pro style fuel processors common on Volvo and Mack heavy-duty diesels. Confirm housing model and element length.',
            'Common interchanges include Baldwin PF9814, WIX 33964, and Donaldson P550849.'
        ),
    },
    'product-fs19765': {
        vehicleFit: ['Kenworth', 'Peterbilt'],
        fitmentDetails: [
            {
                brand: 'Kenworth',
                notes: 'Fuel Pro FH230 / Diesel Pro FH234 style processors — verify housing',
            },
            {
                brand: 'Peterbilt',
                notes: 'Shared Paccar Fuel Pro / Diesel Pro applications — verify housing',
            },
        ],
        seoTitle: 'FS19765 Fuel Water Separator for Kenworth & Peterbilt',
        seoDescription:
            'Buy the FS19765 fuel water separator for Kenworth & Peterbilt Fuel Pro / Diesel Pro systems. 95% water separation. Replaces Baldwin PF7930, Donaldson P550851.',
        faqs: baseFaqs(
            'FS19765',
            'Used on Kenworth and Peterbilt trucks with compatible Fuel Pro FH230 / Diesel Pro FH234 style fuel processors. Match the element to your housing stamp.',
            'Common interchanges include Baldwin PF7930 and Donaldson P550851 / P568522.'
        ),
        description: [
            p(
                'The FS19765 fuel/water separator delivers multi-stage filtration for diesel fuel processors used on Kenworth and Peterbilt trucks. Built with StrataPore-style media, it separates emulsified water and traps solid contaminants to protect high-pressure injectors and pumps.'
            ),
            h('Verified Applications', 'h3'),
            li('Kenworth trucks with compatible Fuel Pro FH230 / Diesel Pro FH234 style housings'),
            li('Peterbilt trucks sharing the same Paccar fuel-processor element size'),
            p(verifyNote('FS19765')),
            h('Why Buy From Semi Filters', 'h3'),
            p(
                'We stock OEM-specification fuel filtration for owner-operators and fleets, with fast US shipping and support from people who know heavy-duty diesel service.'
            ),
        ],
    },
    'product-fs19915': {
        vehicleFit: ['Freightliner'],
        fitmentDetails: [
            {
                brand: 'Freightliner',
                models: ['Cascadia', 'Columbia'],
                engines: ['DD13', 'DD15', 'DD16'],
                notes: 'Primary application — confirm OEM filter list',
            },
        ],
        seoTitle: 'FS19915 Fuel Water Separator for Freightliner Cascadia',
        seoDescription:
            'Shop the FS19915 fuel filter with water separator for Freightliner Cascadia & Columbia with Detroit DD13/DD15/DD16 engines. Replaces Baldwin PF9804, WIX 33655.',
        faqs: baseFaqs(
            'FS19915',
            'Listed primarily for Freightliner Cascadia/Columbia applications with Detroit DD13, DD15, or DD16 engines that call for FS19915. Confirm against your OEM list.',
            'Common interchanges include Baldwin PF9804, WIX 33655, and Donaldson P551011.'
        ),
        description: [
            p(
                'The FS19915 fuel filter with integrated water separator is engineered for Freightliner trucks equipped with Detroit Diesel DD13, DD15, and DD16 engines. High-capacity StrataPore-style media delivers fine particulate filtration and aggressive water separation in one service element.'
            ),
            h('Verified Applications', 'h3'),
            li('Freightliner Cascadia and Columbia with Detroit DD13 / DD15 / DD16 (confirm OEM #)'),
            p(
                'Other chassis that share the same Detroit fuel-processor element may also list FS19915 — always verify the housing stamp and OEM filter chart before purchase.'
            ),
            h('Why Buy From Semi Filters', 'h3'),
            p(
                'OEM-spec fuel filtration, clear cross-references, and fast shipping from Sanford, FL for owner-operators and fleets.'
            ),
        ],
    },
    'product-fs20313': {
        vehicleFit: ['Volvo', 'Mack'],
        fitmentDetails: [
            {
                brand: 'Volvo',
                models: ['VNL'],
                engines: ['D11', 'D13'],
                notes: 'EleMax fuel/water separator cartridge',
            },
            {
                brand: 'Mack',
                models: ['Anthem', 'Pinnacle'],
                engines: ['MP7', 'MP8'],
                notes: 'Shared platform — confirm OEM 24009058 / 24009059',
            },
        ],
        specifications: [
            { label: 'Filter Type', value: 'Fuel / water separator cartridge' },
            { label: 'Technology', value: 'EleMax multi-layer water separation' },
            { label: 'OEM Cross-Refs', value: '24009058, 24009059' },
        ],
        faqs: baseFaqs(
            'FS20313',
            'Listed for Volvo D11/D13 and Mack MP7/MP8 applications that specify FS20313 or OEM numbers 24009058 / 24009059.',
            'Common OEM crosses include Volvo/Mack 24009058 and 24009059.'
        ),
    },
    'product-fs20083': {
        vehicleFit: ['Freightliner', 'Western Star', 'Peterbilt', 'International', 'Volvo'],
        fitmentDetails: [
            {
                brand: 'Freightliner',
                engines: ['DD13', 'DD15', 'DD16'],
                notes: 'DAVCO Fuel Pro 485 / 487 / 488 standard-length element',
            },
            {
                brand: 'Western Star',
                engines: ['DD13', 'DD15', 'DD16'],
                notes: 'DAVCO Fuel Pro 485 / 487 / 488',
            },
            {
                brand: 'Peterbilt',
                engines: ['DD13', 'DD15', 'DD16', 'ISX'],
                notes: 'Confirm Fuel Pro housing model',
            },
            {
                brand: 'International',
                engines: ['A26', 'ISX'],
                notes: 'Confirm Fuel Pro housing model',
            },
            {
                brand: 'Volvo',
                notes: 'Select Fuel Pro 485/487/488 installations — verify housing',
            },
        ],
        faqs: baseFaqs(
            'FS20083',
            'Sized for DAVCO Fuel Pro 485/487/488 processors on Detroit DD13/15/16, Cummins ISX, and related heavy-duty platforms. Match element length to your housing.',
            'Common interchanges include Baldwin PF46145, Donaldson P580710, and related DAVCO element numbers.'
        ),
    },
    'product-03-42776-010': {
        vehicleFit: ['Freightliner'],
        fitmentDetails: [
            {
                brand: 'Freightliner',
                models: ['Cascadia'],
                engines: ['X15', 'ISX', 'DD13', 'DD15', 'DD16'],
                notes: '2018+ Cascadia primary air filter applications',
            },
        ],
        faqs: baseFaqs(
            '03-42776-010',
            'Listed for 2018+ Freightliner Cascadia trucks with Cummins ISX/X15 or Detroit DD13/DD15/DD16 engines where OEM specifies 03-42776-010.',
            'Common interchange: Donaldson P628541 (and related OEM supersessions such as 03-42086-010).'
        ),
    },
    'product-21715813': {
        vehicleFit: ['Volvo'],
        fitmentDetails: [
            {
                brand: 'Volvo',
                models: ['VNL', 'VNM', 'VNR', 'VHD'],
                notes: 'Primary engine air filter',
            },
        ],
        specifications: [
            { label: 'Filter Type', value: 'Primary engine air filter' },
            { label: 'OEM Part Number', value: '21715813' },
            { label: 'Common Cross-Refs', value: 'Baldwin RS4642, WIX 49126, Donaldson P606720' },
        ],
        faqs: baseFaqs(
            '21715813',
            'Listed for Volvo VNL, VNM, VNR, and VHD trucks that call for primary air filter 21715813.',
            'Common interchanges include Baldwin RS4642, WIX 49126, and Donaldson P606720.'
        ),
    },
    'product-af26163m': {
        vehicleFit: ['Volvo'],
        fitmentDetails: [
            {
                brand: 'Volvo',
                models: ['VNL', 'VNM', 'VNX', 'VHD', 'VAH'],
                notes: 'Replaces Volvo 20411815 on many 2004+ applications',
            },
        ],
        specifications: [
            { label: 'Filter Type', value: 'Primary engine air filter' },
            { label: 'Replaces', value: '20411815' },
            { label: 'Common Cross-Refs', value: 'Baldwin RS4642, WIX 49126, Donaldson P606720' },
        ],
        faqs: baseFaqs(
            'AF26163M',
            'Listed for Volvo VNL/VNM/VNX/VHD/VAH applications that specify AF26163M or OEM 20411815.',
            'Common interchanges include Baldwin RS4642, WIX 49126, and Donaldson P605551/P606720.'
        ),
    },
    'product-af27879': {
        vehicleFit: ['Freightliner'],
        fitmentDetails: [
            {
                brand: 'Freightliner',
                models: ['Cascadia', 'Columbia', 'Century'],
                notes: 'Panel-style primary air filter — confirm OEM chart',
            },
        ],
        faqs: baseFaqs(
            'AF27879',
            'Listed for Freightliner Cascadia, Columbia, and Century applications that call for AF27879.',
            'Common interchanges include Baldwin CA5790, WIX 49478, and Donaldson P610260/P618478.'
        ),
    },
    'product-d371061': {
        vehicleFit: ['Kenworth', 'Peterbilt'],
        fitmentDetails: [
            {
                brand: 'Kenworth',
                models: ['T680'],
                notes: '2022+ Paccar OEM air filter applications',
            },
            {
                brand: 'Peterbilt',
                models: ['579'],
                notes: '2022+ Paccar OEM air filter applications',
            },
        ],
        seoTitle: 'D371061 Air Filter for Kenworth T680 & Peterbilt 579',
        seoDescription:
            'Shop the D371061 Paccar OEM engine air filter for 2022+ Kenworth T680 and Peterbilt 579 trucks. Premium glass fiber media. Replaces Donaldson DBA6329.',
        faqs: baseFaqs(
            'D371061',
            'Listed for 2022+ Kenworth T680 and Peterbilt 579 trucks that specify Paccar D371061 (or D37-1061 / D37-1037).',
            'Common interchanges include Donaldson DBA6329 and Paccar D37-1061 / D37-1037.'
        ),
    },
    'product-p611696': {
        vehicleFit: ['Kenworth'],
        fitmentDetails: [
            {
                brand: 'Kenworth',
                models: ['T680', 'T800', 'T880', 'W900'],
                engines: ['MX-13', 'ISX'],
                notes: 'Primary air filter — confirm housing',
            },
        ],
        faqs: baseFaqs(
            'P611696',
            'Listed for Kenworth T680/T800/T880/W900 applications with Paccar MX-13 or Cummins ISX engines that call for P611696.',
            'Common interchanges include Fleetguard AF27688 and WIX 49456.'
        ),
    },
    'product-p621725': {
        vehicleFit: ['Kenworth', 'Peterbilt'],
        fitmentDetails: [
            {
                brand: 'Kenworth',
                models: ['T680', 'T800', 'T880'],
                notes: 'PowerCore G2 panel air filter',
            },
            {
                brand: 'Peterbilt',
                models: ['567', '579'],
                notes: 'PowerCore G2 panel air filter',
            },
        ],
        specifications: [
            { label: 'Filter Type', value: 'PowerCore G2 engine air filter' },
            { label: 'Part Number', value: 'P621725' },
            { label: 'Common Cross-Refs', value: 'Baldwin PA32000, WA11058' },
        ],
        faqs: baseFaqs(
            'P621725',
            'Listed for Kenworth T680/T800/T880 and Peterbilt 567/579 trucks that specify PowerCore element P621725.',
            'Common interchanges include Baldwin PA32000 and WA11058.'
        ),
    },
    'product-a4700903151': {
        vehicleFit: ['Freightliner', 'Western Star'],
        fitmentDetails: [
            {
                brand: 'Freightliner',
                engines: ['DD13', 'DD15', 'DD16'],
                notes: 'Detroit fuel filter insert kit',
            },
            {
                brand: 'Western Star',
                engines: ['DD13', 'DD15', 'DD16'],
                notes: 'Detroit fuel filter insert kit',
            },
        ],
        faqs: baseFaqs(
            'A4700903151',
            'Listed for Freightliner and Western Star trucks with Detroit DD13/DD15/DD16 engines that specify fuel filter kit A4700903151.',
            'Common interchanges include Baldwin PF9908 and related Fleetguard / OEM insert numbers.'
        ),
    },
    'product-a4711800109': {
        vehicleFit: ['Freightliner', 'Western Star'],
        fitmentDetails: [
            {
                brand: 'Freightliner',
                engines: ['DD13', 'DD15', 'DD16'],
                notes: 'Detroit oil filter cartridge kit',
            },
            {
                brand: 'Western Star',
                engines: ['DD13', 'DD15', 'DD16'],
                notes: 'Detroit oil filter cartridge kit',
            },
        ],
        faqs: baseFaqs(
            'A4711800109',
            'Listed for Freightliner and Western Star Detroit DD13/DD15/DD16 oil filter services that call for A4711800109 (or related A4711800209 / A4711800009 supersessions).',
            'Related Detroit kit numbers include A4711800209 and A4711800009 — confirm the exact service kit for your engine vintage.'
        ),
    },
    'product-a4711800209': {
        vehicleFit: ['Freightliner', 'Western Star'],
        fitmentDetails: [
            {
                brand: 'Freightliner',
                models: ['Cascadia'],
                engines: ['DD13', 'DD15', 'DD16'],
                notes: 'Gen 5 Detroit oil cartridge (2020+)',
            },
            {
                brand: 'Western Star',
                engines: ['DD13', 'DD15', 'DD16'],
                notes: 'Gen 5 Detroit oil cartridge (2020+)',
            },
        ],
        faqs: baseFaqs(
            'A4711800209',
            'Listed for 2020+ Detroit DD13/DD15/DD16 Gen 5 oil filter service on Freightliner Cascadia and Western Star applications.',
            'Common interchanges include Fleetguard LF17810/LF17800, Donaldson P582506, and WIX WL10663.'
        ),
    },
    'product-a4720921705': {
        vehicleFit: ['Freightliner', 'Western Star', 'Peterbilt'],
        fitmentDetails: [
            {
                brand: 'Freightliner',
                engines: ['DD13', 'DD15', 'DD16'],
                notes: '2020+ Detroit fuel filter kit',
            },
            {
                brand: 'Western Star',
                engines: ['DD13', 'DD15', 'DD16'],
                notes: '2020+ Detroit fuel filter kit',
            },
            {
                brand: 'Peterbilt',
                engines: ['DD13', 'DD15', 'DD16'],
                notes: 'Select Detroit-powered Peterbilt applications — verify OEM',
            },
        ],
        faqs: baseFaqs(
            'A4720921705',
            'Listed for 2020+ Detroit DD13/DD15/DD16 fuel filter kits on Freightliner, Western Star, and select Peterbilt chassis. Confirm the OEM fuel kit number.',
            'Common interchanges include Fleetguard FK11011, Donaldson P582831, and Baldwin PF46269.'
        ),
    },
    'product-r61709': {
        vehicleFit: ['Freightliner', 'Western Star'],
        fitmentDetails: [
            {
                brand: 'Freightliner',
                models: ['Cascadia', 'M2'],
                engines: ['DD13', 'DD15', 'DD16'],
                notes: 'Fits Detroit 03-40538-009 fuel processor housing',
            },
            {
                brand: 'Western Star',
                engines: ['DD13', 'DD15', 'DD16'],
                notes: 'Fits Detroit 03-40538-009 housing',
            },
        ],
        faqs: baseFaqs(
            'R61709',
            'Cartridge for Detroit DD13/DD15/DD16 fuel processors using housing 03-40538-009 on Freightliner Cascadia/M2 and Western Star.',
            'Common interchanges include Fleetguard FS20176, Baldwin PF46235, and Donaldson P552709.'
        ),
    },
    'product-kit--1': {
        vehicleFit: ['Volvo'],
        fitmentDetails: [
            {
                brand: 'Volvo',
                models: ['VNL'],
                engines: ['D12', 'D13'],
                notes: 'Includes 21707132, 2×23658092, 23920469',
            },
        ],
        faqs: baseFaqs(
            'this Volvo VNL D13 engine filter kit',
            'Bundled for Volvo VNL D12/D13 maintenance that uses bypass oil filter 21707132, long-life oil filters 23658092, and fuel filter 23920469. Confirm each OEM number on your truck.'
        ),
    },
    'product-kit--2': {
        vehicleFit: ['Volvo'],
        fitmentDetails: [
            {
                brand: 'Volvo',
                models: ['VNL'],
                engines: ['D12', 'D13'],
                notes: 'Includes FS20313, 23920469, 2×23151592',
            },
        ],
        faqs: baseFaqs(
            'this Volvo fuel & oil change kit',
            'Bundled for Volvo VNL D12/D13 services using oil filters 23151592, fuel filter 23920469, and FS20313 water separator. Verify each part against your OEM list.'
        ),
    },
    'product-kit--3': {
        vehicleFit: ['Volvo'],
        fitmentDetails: [
            {
                brand: 'Volvo',
                models: ['VNL'],
                engines: ['D12', 'D13'],
                notes: 'Includes 21707132 + 2×23658092',
            },
        ],
        faqs: baseFaqs(
            'this Volvo oil filter change kit',
            'Bundled for Volvo VNL D12/D13 oil service using bypass 21707132 and long-life filters 23658092.'
        ),
    },
    'product-kit--4': {
        vehicleFit: ['Volvo'],
        fitmentDetails: [
            {
                brand: 'Volvo',
                models: ['VNL'],
                engines: ['D12', 'D13'],
                notes: 'Oil, fuel, and water-separator bundle',
            },
        ],
        faqs: baseFaqs(
            'this complete Volvo engine filter kit',
            'Full preventive-maintenance bundle for Volvo VNL D12/D13 covering oil, fuel, and water separation. Confirm every included OEM number before install.'
        ),
    },
    'product-kit--5': {
        vehicleFit: ['Volvo'],
        fitmentDetails: [
            {
                brand: 'Volvo',
                models: ['VNL'],
                engines: ['D12', 'D13'],
                notes: 'Includes FS20313 + 2×23151592',
            },
        ],
        faqs: baseFaqs(
            'this Volvo fuel & oil service kit',
            'Bundled for Volvo VNL D12/D13 using oil filters 23151592 and EleMax separator FS20313.'
        ),
    },
    'product-kit--6': {
        vehicleFit: ['Volvo'],
        fitmentDetails: [
            {
                brand: 'Volvo',
                models: ['VNL'],
                engines: ['D11', 'D12', 'D13'],
                notes: 'Includes 23920469 + 2×23151592',
            },
        ],
        faqs: baseFaqs(
            'this Volvo fuel & oil filter kit',
            'Bundled for Volvo VNL D11/D12/D13 using oil filters 23151592 and secondary fuel filter 23920469.'
        ),
    },
    'product-red-lamp': {
        vehicleFit: ['Volvo', 'Freightliner', 'Kenworth'],
        fitmentDetails: [
            { brand: 'Volvo', notes: 'Universal oval stop/turn/tail lamp — check mounting & plug' },
            { brand: 'Freightliner', notes: 'Universal oval stop/turn/tail lamp — check mounting & plug' },
            { brand: 'Kenworth', notes: 'Universal oval stop/turn/tail lamp — check mounting & plug' },
        ],
        faqs: baseFaqs(
            '60250R',
            'Universal oval LED stop/turn/tail lamp for many Class 8 trucks and trailers. Confirm oval cutout, grommet, and plug style before ordering.'
        ),
    },
    'product-white-lamp': {
        vehicleFit: ['Volvo', 'Freightliner', 'Kenworth'],
        fitmentDetails: [
            { brand: 'Volvo', notes: 'Universal oval backup lamp — check mounting & plug' },
            { brand: 'Freightliner', notes: 'Universal oval backup lamp — check mounting & plug' },
            { brand: 'Kenworth', notes: 'Universal oval backup lamp — check mounting & plug' },
        ],
        faqs: baseFaqs(
            '6060C',
            'Universal oval LED backup lamp for many Class 8 trucks and trailers. Confirm oval cutout, grommet, and wiring before ordering.'
        ),
    },
}

const categorySeo: Record<string, { seoTitle: string; seoDescription: string; description: string }> = {
    'oil-filters': {
        seoTitle: 'Semi Truck Oil Filters — OEM-Spec Heavy-Duty',
        seoDescription:
            'Shop OEM-specification oil filters for Volvo, Freightliner, Kenworth, Peterbilt, Mack, and Detroit diesels. Full-flow, bypass, and cartridge kits with fast US shipping.',
        description:
            'OEM-spec full-flow, bypass, and Detroit cartridge oil filters for Class 8 trucks. Match your engine and OEM number, then order with fast shipping from Semi Filters.',
    },
    'air-filters': {
        seoTitle: 'Semi Truck Air Filters — Cascadia, VNL, T680 & More',
        seoDescription:
            'Engine air filters for Freightliner Cascadia, Volvo VNL, Kenworth T680, Peterbilt 579, and more. OEM-quality media with clear cross-references.',
        description:
            'Primary engine air filters for major Class 8 platforms. Find Cascadia, VNL, T680/579, and PowerCore elements with verified interchange numbers.',
    },
    'fuel-filters': {
        seoTitle: 'Semi Truck Fuel Filters & Water Separators',
        seoDescription:
            'Fuel filters and fuel/water separators for DAVCO Fuel Pro, Detroit, Volvo, and Mack diesels. OEM crosses and housing guidance for safer fitment.',
        description:
            'Secondary fuel filters and fuel/water separators for Detroit, Volvo, Mack, and DAVCO Fuel Pro systems — with cross-refs and housing notes.',
    },
    'cabin-filters': {
        seoTitle: 'Semi Truck Cabin Air Filters',
        seoDescription:
            'Cabin air filters for Class 8 trucks. Improve HVAC air quality for long-haul comfort. OEM-spec options with fast shipping.',
        description:
            'Cabin / HVAC filters for semi trucks. Replace on schedule to keep dust, pollen, and road soot out of the cab.',
    },
    'accessories-kits': {
        seoTitle: 'Semi Truck Filter Kits & Accessories',
        seoDescription:
            'Volvo VNL filter change kits, LED truck lamps, and multi-system bundles. Save time with pre-matched OEM-spec parts.',
        description:
            'Maintenance kits and accessories for Class 8 service — including Volvo VNL oil/fuel kits and DOT-compliant LED lamps.',
    },
}

type GuideSeed = {
    _id: string
    title: string
    slug: string
    excerpt: string
    seoTitle: string
    seoDescription: string
    relatedTruckBrands: string[]
    faqs: Faq[]
    body: Block[]
}

const guides: GuideSeed[] = [
    {
        _id: 'guide-oem-cross-reference',
        title: 'How to Cross-Reference OEM Semi Truck Filter Part Numbers',
        slug: 'oem-filter-cross-reference-guide',
        excerpt:
            'Learn how to match OEM filter numbers to Baldwin, Fleetguard, Donaldson, WIX, and other interchanges without guessing fitment.',
        seoTitle: 'OEM Semi Truck Filter Cross-Reference Guide',
        seoDescription:
            'Step-by-step guide to cross-referencing OEM semi truck oil, air, and fuel filter part numbers. Verify fitment before you buy.',
        relatedTruckBrands: ['Volvo', 'Freightliner', 'Kenworth', 'Peterbilt', 'Mack'],
        faqs: [
            {
                question: 'Is a cross-reference always a perfect fit?',
                answer:
                    'No. Cross-refs are a starting point. Confirm element length, thread, gasket, and housing model — especially on fuel processors.',
            },
            {
                question: 'What should I trust most — OEM or aftermarket number?',
                answer:
                    'Start with the number stamped on the filter currently installed or listed in the OEM maintenance chart for your VIN/engine.',
            },
        ],
        body: [
            p(
                'Buying the wrong filter costs downtime. Use this process every time you cross an OEM oil, air, or fuel filter number.'
            ),
            h('1. Start with the number on the truck'),
            li('Read the part number on the filter you are removing'),
            li('Check the OEM maintenance chart or dealer parts lookup for your VIN/engine'),
            li('Note the housing model for fuel processors (e.g. DAVCO Fuel Pro 485)'),
            h('2. Compare interchange lists carefully'),
            p(
                'Baldwin, Fleetguard, Donaldson, WIX, and Paccar/Volvo/Mack numbers often interchange — but media type, micron rating, and element length can differ. Prefer listings that also match housing and engine family.'
            ),
            h('3. Verify before install'),
            li('Match gasket OD/ID and thread on spin-ons'),
            li('Match cartridge length and seal kit on Detroit/Volvo cartridge systems'),
            li('When unsure, contact Semi Filters with your VIN, engine, and current filter number'),
            p('Browse verified products in our oil, air, and fuel filter collections, or shop by truck brand.'),
        ],
    },
    {
        _id: 'guide-cascadia-filters',
        title: 'Freightliner Cascadia Oil, Fuel & Air Filter Basics',
        slug: 'freightliner-cascadia-filter-guide',
        excerpt:
            'A practical overview of Cascadia filtration — air elements, Detroit fuel/water separators, and oil service kits.',
        seoTitle: 'Freightliner Cascadia Filter Guide — Oil, Fuel & Air',
        seoDescription:
            'Freightliner Cascadia filter basics for DD13/DD15/DD16 and Cummins X15. Air, oil, and fuel/water separator guidance with OEM verification tips.',
        relatedTruckBrands: ['Freightliner', 'Western Star'],
        faqs: [
            {
                question: 'Do all Cascadias use the same air filter?',
                answer:
                    'No. Model year and airbox design matter. Confirm OEM numbers such as 03-42776-010 or AF27879 against your truck.',
            },
            {
                question: 'Which fuel filter does a DD15 Cascadia use?',
                answer:
                    'It depends on the fuel processor. Common elements include FS19915, R61709, FS20083, and Detroit kits like A4720921705 — match the housing stamp.',
            },
        ],
        body: [
            p(
                'Freightliner Cascadia is one of the most common Class 8 platforms on US highways. Filtration packages vary by engine (Detroit DD13/DD15/DD16 or Cummins ISX/X15) and fuel-processor housing.'
            ),
            h('Air filtration'),
            p(
                'Common Cascadia air elements include 03-42776-010 (2018+) and AF27879 on earlier/alternate airboxes. Always match the OEM air filter chart for your year.'
            ),
            h('Fuel & water separation'),
            p(
                'Detroit-powered Cascadias may use cartridge separators (R61709), spin-on/style elements (FS19915), DAVCO Fuel Pro elements (FS20083), or Detroit service kits (A4700903151 / A4720921705). The housing model is the truth source.'
            ),
            h('Oil service'),
            p(
                'Gen 5 Detroit engines often use cartridge kits such as A4711800209. Confirm engine vintage before ordering.'
            ),
            p('Shop all Freightliner filters or jump to fuel filters and oil filters.'),
        ],
    },
    {
        _id: 'guide-volvo-vnl-d13',
        title: 'Volvo VNL / D13 Filtration Overview',
        slug: 'volvo-vnl-d13-filtration-overview',
        excerpt:
            'How Volvo VNL D11/D12/D13 oil, fuel, and air filtration stacks work — including bypass oil filters and FS20313 separators.',
        seoTitle: 'Volvo VNL D13 Filtration Overview — Oil, Fuel & Air',
        seoDescription:
            'Volvo VNL filtration guide for D11/D12/D13: bypass and full-flow oil filters, secondary fuel filters, FS20313 water separators, and air elements.',
        relatedTruckBrands: ['Volvo', 'Mack'],
        faqs: [
            {
                question: 'Why does my Volvo use two oil filters?',
                answer:
                    'Many Volvo diesels use a full-flow filter plus a bypass filter for finer polishing. Kits often pair 23151592 or 23658092 with bypass 21707132.',
            },
            {
                question: 'Does Mack share Volvo filter numbers?',
                answer:
                    'Often yes on shared platforms (MP7/MP8 ↔ D11/D13). Still verify the Mack OEM number before substituting.',
            },
        ],
        body: [
            p(
                'Volvo VNL trucks with D11/D12/D13 engines use a layered filtration strategy: primary oil filtration, optional bypass polishing, secondary fuel filtration, and a dedicated air element.'
            ),
            h('Oil system'),
            li('Full-flow: 23151592 or long-life 23658092 (application dependent)'),
            li('Bypass: 21707132 on many D11–D13 builds'),
            h('Fuel system'),
            li('Secondary fuel: 23920469 (and late-model 24137737 on 2024+ D13 / Mack MP8)'),
            li('Water separator: FS20313 or FS19764 depending on processor'),
            h('Air system'),
            li('Common primary elements: 21715813 and AF26163M (replaces 20411815 on many trucks)'),
            p('Browse Volvo filters or grab a pre-matched VNL service kit.'),
        ],
    },
    {
        _id: 'guide-t680-579',
        title: 'Kenworth T680 & Peterbilt 579 Shared Platform Filters',
        slug: 'kenworth-t680-peterbilt-579-filters',
        excerpt:
            'Paccar T680 and 579 trucks share many air and fuel filtration designs. Here is how to match the right element.',
        seoTitle: 'Kenworth T680 & Peterbilt 579 Filter Guide',
        seoDescription:
            'Filter guide for Kenworth T680 and Peterbilt 579 shared platforms — D371061 and P621725 air filters, Fuel Pro separators, and verification tips.',
        relatedTruckBrands: ['Kenworth', 'Peterbilt'],
        faqs: [
            {
                question: 'Do T680 and 579 use the same air filter?',
                answer:
                    'Many 2022+ trucks share Paccar D371061. Earlier PowerCore applications may list P621725. Confirm the airbox and OEM chart.',
            },
            {
                question: 'What fuel separator do Paccar trucks use?',
                answer:
                    'Fuel Pro / Diesel Pro housings are common. FS19765 is a frequent element — match length and housing model first.',
            },
        ],
        body: [
            p(
                'Kenworth T680 and Peterbilt 579 share Paccar engineering. That means many air and fuel filters interchange across brands — but only when the OEM number and housing match.'
            ),
            h('Air filters'),
            li('D371061 — common on 2022+ T680 / 579'),
            li('P621725 — PowerCore G2 panel on select T680/T880 and 567/579 builds'),
            li('P611696 — older/alternate Kenworth airboxes (T680/T800/T880/W900)'),
            h('Fuel filtration'),
            p(
                'Confirm whether you have a Fuel Pro FH230, Diesel Pro FH234, or other processor before ordering FS19765 or related elements.'
            ),
            p('Shop Kenworth filters or Peterbilt filters.'),
        ],
    },
    {
        _id: 'guide-fuel-pro',
        title: 'Fuel Pro / Diesel Pro Filter & Water-Separator Guide',
        slug: 'davco-fuel-pro-filter-guide',
        excerpt:
            'How to identify DAVCO Fuel Pro and Diesel Pro housings and pick the correct fuel/water separator element.',
        seoTitle: 'DAVCO Fuel Pro Filter Guide — FS20083, FS19764, FS19765',
        seoDescription:
            'Identify Fuel Pro 485/487/488 and related housings, then choose the correct fuel/water separator element. Avoid length mismatches.',
        relatedTruckBrands: ['Freightliner', 'Volvo', 'Kenworth', 'Peterbilt', 'International', 'Western Star'],
        faqs: [
            {
                question: 'How do I know which Fuel Pro element I need?',
                answer:
                    'Read the housing model label (e.g. 485/487/488) and the element number stamped on the current cartridge. Length and seal design must match.',
            },
            {
                question: 'Can I swap FS19764 and FS19765?',
                answer:
                    'Not interchangeably by default. They target different processor applications. Match the OEM/housing stamp.',
            },
        ],
        body: [
            p(
                'DAVCO Fuel Pro and Diesel Pro systems protect injectors by combining particulate filtration with water separation. The wrong element length or seal is a common no-start / leak issue.'
            ),
            h('Identify the housing'),
            li('Look for the model tag on the Fuel Pro / Diesel Pro unit'),
            li('Note clear bowl vs metal, and standard vs long element'),
            li('Photograph the current cartridge part number before removal'),
            h('Common Semi Filters elements'),
            li('FS20083 — Fuel Pro 485/487/488 standard-length EleMax element'),
            li('FS19764 — Volvo/Mack Fuel Pro style applications'),
            li('FS19765 — Kenworth/Peterbilt Fuel Pro / Diesel Pro applications'),
            li('FS20313 — Volvo/Mack EleMax separator on listed D11/D13 and MP7/MP8 apps'),
            p('When in doubt, send Semi Filters a photo of the housing tag and current element.'),
        ],
    },
    {
        _id: 'guide-bypass-vs-fullflow',
        title: 'Bypass vs Full-Flow Oil Filters on Heavy-Duty Diesels',
        slug: 'bypass-vs-full-flow-oil-filters',
        excerpt:
            'Understand why many Volvo and Mack diesels use both a full-flow and a bypass oil filter — and when each is due for service.',
        seoTitle: 'Bypass vs Full-Flow Oil Filters for Semi Trucks',
        seoDescription:
            'Explanation of full-flow vs bypass oil filtration on heavy-duty diesels, with Volvo 23151592 / 23658092 and bypass 21707132 examples.',
        relatedTruckBrands: ['Volvo', 'Mack'],
        faqs: [
            {
                question: 'Can I skip the bypass filter?',
                answer:
                    'If your engine is designed for two-stage filtration, skipping bypass raises soot and fine-particle load on bearings over long drains. Follow the OEM service design.',
            },
            {
                question: 'Are long-life and standard full-flow filters the same?',
                answer:
                    'Not always. Long-life elements (e.g. 23658092) are built for extended drains. Use the media type your oil drain interval requires.',
            },
        ],
        body: [
            p(
                'Full-flow oil filters clean nearly all oil leaving the pump. Bypass filters sample a smaller flow and polish finer particles — common on Volvo D11–D13 and related Mack platforms.'
            ),
            h('Full-flow'),
            p('Examples: 23151592 (standard) and 23658092 (long-life). This is your primary engine protection filter.'),
            h('Bypass'),
            p('Example: 21707132. It is not a substitute for the full-flow filter — it works with it.'),
            h('Service tip'),
            p(
                'Replace both when the OEM interval calls for a full oil service. Semi Filters VNL kits bundle matched pairs to reduce ordering mistakes.'
            ),
        ],
    },
    {
        _id: 'guide-cabin-air',
        title: 'Cabin Air Filters for Semi Trucks — When to Replace',
        slug: 'semi-truck-cabin-air-filter-replacement',
        excerpt:
            'Cabin/HVAC filters protect driver air quality. Here is when to replace them and what to watch for on long-haul trucks.',
        seoTitle: 'When to Replace Semi Truck Cabin Air Filters',
        seoDescription:
            'Cabin air filter replacement intervals and symptoms for Class 8 trucks. Keep HVAC airflow and cab air quality in spec.',
        relatedTruckBrands: ['Volvo', 'Freightliner', 'Kenworth', 'Peterbilt', 'Mack'],
        faqs: [
            {
                question: 'How often should I change a cabin filter?',
                answer:
                    'Many fleets inspect every PM and replace at least annually — sooner in dusty, agricultural, or wildfire-smoke regions.',
            },
            {
                question: 'What are symptoms of a clogged cabin filter?',
                answer:
                    'Weak vent airflow, musty odor, fogging, and HVAC blower strain are common signs.',
            },
        ],
        body: [
            p(
                'Cabin air filters are easy to overlook, but they matter for driver alertness and HVAC performance — especially on sleeper trucks.'
            ),
            h('Replace sooner if you notice'),
            li('Reduced dash airflow on high blower'),
            li('Dust film on the dash shortly after cleaning'),
            li('Musty odor when A/C first engages'),
            h('Fitment tip'),
            p(
                'Cabin elements are model-specific. Use your truck brand + HVAC housing number, not just the engine filter chart. Shop our cabin filter collection when available for your platform.'
            ),
        ],
    },
    {
        _id: 'guide-fleet-stocking',
        title: 'Fleet Buying Guide: Stocking Oil, Air & Fuel Filters',
        slug: 'fleet-filter-stocking-guide',
        excerpt:
            'A simple stocking model for fleets: prioritize high-turn oil/fuel elements, keep air filters by airbox family, and standardize cross-refs.',
        seoTitle: 'Fleet Guide to Stocking Semi Truck Filters',
        seoDescription:
            'How fleets should stock oil, air, and fuel filters for mixed Volvo, Freightliner, Kenworth, and Peterbilt equipment without over-inventory.',
        relatedTruckBrands: ['Volvo', 'Freightliner', 'Kenworth', 'Peterbilt', 'Mack', 'Western Star'],
        faqs: [
            {
                question: 'What should a mixed fleet stock first?',
                answer:
                    'Highest-turn oil and fuel/water separators for your top two engine families, plus the air elements for your top two airboxes.',
            },
            {
                question: 'Do you offer fleet pricing?',
                answer:
                    'Yes. Contact support@semifilters.com or call (407) 768-1488 for volume quotes and scheduled replenishment.',
            },
        ],
        body: [
            p(
                'Overstocking rare cabin or specialty filters ties up cash. Understocking oil and fuel elements causes downtime. Use turns and engine-family coverage.'
            ),
            h('Stocking tiers'),
            li('Tier 1 (always on hand): full-flow oil + primary fuel/water separators for top engines'),
            li('Tier 2: bypass oil filters, secondary fuel filters, and common air elements'),
            li('Tier 3: lamps, specialty kits, low-turn cabin filters'),
            h('Standardize part numbers'),
            p(
                'Pick one preferred interchange family per OEM number in your CMMS. Semi Filters listings include cross-refs so techs can verify quickly.'
            ),
            p('Ask us for a custom stocking list based on your VIN/engine mix.'),
        ],
    },
]

async function patchProducts() {
    const ids = Object.keys(patches)
    console.log(`Patching ${ids.length} products...`)
    for (const id of ids) {
        const data = patches[id]
        const set: Record<string, unknown> = {}
        if (data.vehicleFit) set.vehicleFit = data.vehicleFit
        if (data.fitmentDetails) set.fitmentDetails = withKeys(data.fitmentDetails)
        if (data.faqs) set.faqs = withKeys(data.faqs)
        if (data.specifications) {
            set.specifications = withKeys(data.specifications)
        }
        if (data.seoTitle) set.seoTitle = data.seoTitle
        if (data.seoDescription) set.seoDescription = data.seoDescription
        if (data.name) set.name = data.name
        if (data.description) set.description = data.description

        await client.patch(id).set(set).commit()
        console.log(`  OK ${id}`)
    }
}

async function patchCategories() {
    const categories: { _id: string; slug?: { current?: string } }[] = await client.fetch(
        `*[_type == "category"]{ _id, slug }`
    )
    console.log(`\nPatching ${categories.length} categories...`)
    for (const cat of categories) {
        const slug = cat.slug?.current || ''
        const seo = categorySeo[slug]
        if (!seo) {
            console.log(`  SKIP category ${slug || cat._id}`)
            continue
        }
        await client.patch(cat._id).set(seo).commit()
        console.log(`  OK ${slug}`)
    }
}

async function seedGuides() {
    console.log(`\nSeeding ${guides.length} guides...`)
    for (const g of guides) {
        await client.createOrReplace({
            _id: g._id,
            _type: 'guide',
            title: g.title,
            slug: { _type: 'slug', current: g.slug },
            excerpt: g.excerpt,
            publishedAt: new Date().toISOString(),
            published: true,
            seoTitle: g.seoTitle,
            seoDescription: g.seoDescription,
            relatedTruckBrands: g.relatedTruckBrands,
            faqs: withKeys(g.faqs),
            body: g.body,
        })
        console.log(`  OK ${g.slug}`)
    }
}

async function main() {
    if (!process.env.SANITY_API_TOKEN) {
        throw new Error('SANITY_API_TOKEN is required')
    }
    await patchProducts()
    await patchCategories()
    await seedGuides()
    console.log('\nMigration complete.')
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
