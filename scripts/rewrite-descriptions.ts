/**
 * Migration script: Rewrites all product descriptions with professional,
 * SEO-optimized Portable Text content.
 *
 * Usage:
 *   npx tsx scripts/rewrite-descriptions.ts
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
} catch {}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2025-03-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN!,
})

let keyCounter = 0
function uid(): string {
    return `desc_${Date.now()}_${++keyCounter}`
}

type Block = {
    _key: string
    _type: 'block'
    children: { _key: string; _type: 'span'; marks: string[]; text: string }[]
    markDefs: never[]
    style: string
    level?: number
    listItem?: string
}

function heading(text: string, level: 'h3' = 'h3'): Block {
    return {
        _key: uid(), _type: 'block',
        children: [{ _key: uid(), _type: 'span', marks: ['strong'], text }],
        markDefs: [], style: level,
    }
}

function para(text: string): Block {
    return {
        _key: uid(), _type: 'block',
        children: [{ _key: uid(), _type: 'span', marks: [], text }],
        markDefs: [], style: 'normal',
    }
}

function bullet(text: string): Block {
    return {
        _key: uid(), _type: 'block',
        children: [{ _key: uid(), _type: 'span', marks: [], text }],
        markDefs: [], style: 'normal', level: 1, listItem: 'bullet',
    }
}

function boldPara(text: string): Block {
    return {
        _key: uid(), _type: 'block',
        children: [{ _key: uid(), _type: 'span', marks: ['strong'], text }],
        markDefs: [], style: 'normal',
    }
}

// ---------------------------------------------------------------------------
// Product descriptions keyed by Sanity document _id
// ---------------------------------------------------------------------------
const descriptions: Record<string, Block[]> = {

    // ── Oil Filters ──────────────────────────────────────────────────────

    'product-21707132': [
        para('The 21707132 bypass oil filter is engineered specifically for Volvo D11, D12, and D13 diesel engines. As a secondary filtration stage, it works alongside the primary oil filter to capture ultra-fine contaminants — including carbon residue, soot particles, and microscopic metal fragments — that standard full-flow filters cannot trap.'),
        heading('Key Features'),
        bullet('Spin-on bypass design for quick, tool-free installation'),
        bullet('Extended-life filtration media rated for full OEM service intervals'),
        bullet('1 3/8"-16 thread size with 108 mm gasket OD for a precise, leak-free seal'),
        bullet('Meets or exceeds OEM specifications for Volvo heavy-duty applications'),
        heading('Why It Matters'),
        para('Bypass filtration significantly reduces engine wear by continuously polishing the oil supply. Over time, this extends bearing life, reduces sludge buildup, and helps maintain consistent oil pressure — lowering your total cost of ownership and minimizing unscheduled downtime.'),
        heading('Vehicle Compatibility'),
        para('Direct replacement for Volvo trucks equipped with D11, D12, and D13 engines, including the VNL, VNM, VHD, and VNX model lines. Also replaces Mack part numbers 20843764 and 20845764 on Mack MP7 and MP8 platforms.'),
    ],

    'product-23151592': [
        para('The 23151592 is an OEM-specification full-flow oil filter designed for Volvo D11, D12, and D13 heavy-duty diesel engines. It serves as the primary line of defense against harmful contaminants, capturing dirt, metal particles, and combustion byproducts before they can damage critical engine components.'),
        heading('Key Features'),
        bullet('Spin-on full-flow design — installs in minutes with no special tools'),
        bullet('M32 × 1.5 thread size with a 4.23" outer diameter for factory-exact fitment'),
        bullet('99% filtration efficiency at 40 microns (ISO standard)'),
        bullet('High-capacity media for extended service intervals up to 60,000 miles'),
        heading('Engineered for Durability'),
        para('Built with heavy-gauge steel housing and a reinforced bypass valve, this filter maintains structural integrity under the extreme oil pressures and temperature swings common in long-haul diesel operations. The anti-drainback design ensures immediate oil flow on cold starts, protecting the engine during its most vulnerable moments.'),
        heading('Vehicle Compatibility'),
        para('Direct fit for Volvo VNL, VNM, VNR, and VHD trucks. Also cross-references to Mack 23155587 for MP7 and MP8 engine platforms.'),
    ],

    'product-23658092': [
        para('The 23658092 long-life oil filter is a high-capacity spin-on filter engineered for Volvo and Volvo Penta diesel engines. Designed for extended drain intervals, it provides superior contaminant removal across a wide range of heavy-duty D9, D10, D11, D12, D13, and D16 engine platforms.'),
        heading('Key Features'),
        bullet('Extended-life media technology — rated for service intervals up to 60,000+ miles'),
        bullet('Advanced synthetic filtration captures particles down to 10 microns'),
        bullet('Reinforced housing withstands high oil pressures and extreme thermal cycling'),
        bullet('Integrated bypass valve ensures uninterrupted oil flow under all conditions'),
        heading('Reduce Maintenance, Maximize Uptime'),
        para('By doubling or tripling standard replacement intervals, the 23658092 directly reduces maintenance costs and shop time. Fewer filter changes mean less waste oil to dispose of and more miles between service stops — a measurable advantage for owner-operators and fleet managers tracking cost-per-mile.'),
        heading('Vehicle Compatibility'),
        para('Direct OEM replacement for Volvo VNL, VNM, VHD, and VNX trucks, as well as Volvo Penta marine and industrial engines. Replaces older Volvo part numbers 2170133 and 478736.'),
    ],

    // ── Fuel Filters ─────────────────────────────────────────────────────

    'product-23920469': [
        para('The 23920469 is a secondary fuel filter engineered for Volvo D11 and D13 heavy-duty diesel engines. Positioned downstream in the fuel system, it provides a critical final stage of filtration — removing microscopic contaminants and trace water before fuel reaches the high-pressure common rail injection system.'),
        heading('Key Features'),
        bullet('99.9% filtration efficiency at 4 microns (ISO 2942 standard)'),
        bullet('Spin-on design with M32 × 1.5 thread for fast, leak-free replacement'),
        bullet('250 psi collapse/burst rating for reliable performance under pressure'),
        bullet('4.23" outer diameter — direct dimensional match for OEM housing'),
        heading('Protect Your Injection System'),
        para('Modern common rail diesel injectors operate at pressures exceeding 30,000 psi with tolerances measured in microns. Even trace amounts of contamination can cause injector scoring, poor spray patterns, and costly failures. This filter is your last line of defense, ensuring only ultra-clean fuel reaches these precision components.'),
        heading('Vehicle Compatibility'),
        para('Designed for Volvo VNL, VNR, and VHD trucks equipped with D11 and D13 engines. Pairs with the primary fuel filter for complete system protection.'),
    ],

    'product-fs19764': [
        para('The FS19764 is a high-performance fuel/water separator designed for heavy-duty diesel engines. Utilizing StrataPore multi-layer filtration media, it delivers exceptional water separation and particulate removal to protect fuel injectors, pumps, and other sensitive fuel system components from contamination and corrosion.'),
        heading('Key Features'),
        bullet('StrataPore media provides multi-stage contaminant and water removal'),
        bullet('98.7% primary particle capture efficiency (SAE J1985)'),
        bullet('Plus-size element for extended service intervals over the standard FS19727'),
        bullet('Spin-on design for quick, straightforward replacement'),
        heading('Why Water Separation Matters'),
        para('Water in diesel fuel accelerates corrosion, promotes microbial growth, and causes cavitation damage in high-pressure injection systems. The FS19764 actively coalesces and separates emulsified water, draining it to a collection bowl before it can reach sensitive engine components — reducing repair costs and preventing unplanned downtime.'),
        heading('Vehicle Compatibility'),
        para('Compatible with Volvo and Mack heavy-duty applications utilizing Davco Fuel Pro FH230 Series fuel processor systems. Also fits a wide range of agricultural and industrial diesel equipment.'),
    ],

    'product-fs19765': [
        para('The FS19765 fuel/water separator delivers reliable multi-stage filtration for diesel fuel systems. Built with StrataPore media technology, it effectively separates emulsified water and traps solid contaminants — safeguarding high-pressure fuel injectors and pumps from premature wear and costly failures.'),
        heading('Key Features'),
        bullet('25-micron StrataPore media with 98.7% particle capture efficiency'),
        bullet('95% emulsified water separation rate'),
        bullet('Plus-size element extends service intervals beyond standard filters'),
        bullet('Patented control valve ensures full utilization of filter capacity'),
        bullet('Biodiesel compatible for modern fuel blends'),
        heading('Application & Fitment'),
        para('Designed for use in Fuel Pro FH230 Series and Diesel Pro FH234 Series Industrial Pro fuel processor systems. Suitable for heavy-duty on-highway, construction, and industrial diesel equipment. Direct replacement with no modifications required.'),
    ],

    'product-fs19915': [
        para('The FS19915 fuel filter with integrated water separator is engineered for Freightliner trucks equipped with Detroit Diesel DD13, DD15, and DD16 engines. Its high-capacity StrataPore media delivers both fine particulate filtration and aggressive water separation in a single, easy-to-replace spin-on element.'),
        heading('Key Features'),
        bullet('98.7% primary particle capture efficiency with StrataPore media'),
        bullet('98% emulsified water separation rate (SAE J1488)'),
        bullet('Rated flow of 7.00 L/min — optimized for 10–18L diesel engines'),
        bullet('Extended-capacity design reduces change intervals and lowers maintenance costs'),
        bullet('Fully biodiesel compatible'),
        heading('Built for Demanding Conditions'),
        para('Long-haul diesel operations expose fuel systems to temperature extremes, condensation, and varying fuel quality across different regions. The FS19915 is specifically developed to handle these severe conditions, combating the water contamination challenges that commonly face operators of heavy-duty diesel equipment.'),
        heading('Vehicle Compatibility'),
        para('Direct fit for Freightliner Cascadia and Columbia trucks with Detroit Diesel DD15 engines. Also compatible with select Kenworth and Peterbilt applications using similar fuel processor systems.'),
    ],

    'product-fs20313': [
        para('The FS20313 is a next-generation fuel/water separator cartridge featuring Fleetguard EleMax multi-layer water separation technology. Designed for Volvo D11 and D13 as well as Mack MP7 and MP8 engines, it provides three-stage water removal architecture for the most demanding diesel fuel environments.'),
        heading('Key Features'),
        bullet('EleMax three-stage water separation for superior moisture removal'),
        bullet('Cartridge-style element — 7.36" height × 4.50" outer diameter'),
        bullet('Rated flow of 2.91 GPM (11.00 L/min) for high-output diesel engines'),
        bullet('Engineered to meet or exceed Volvo and Mack OEM filtration requirements'),
        heading('Advanced Water Removal Technology'),
        para('The EleMax system uses a coalescing pre-filter, a hydrophobic barrier, and a final polishing stage to remove both free and emulsified water from diesel fuel. This multi-layer approach delivers consistently low water levels downstream — critical for protecting modern common rail injection systems operating at extreme pressures.'),
        heading('Vehicle Compatibility'),
        para('Direct OEM replacement for Volvo VNL, VNR, and VHD trucks (Volvo 24009059) and Mack Anthem and Pinnacle trucks (Mack 24009058).'),
    ],

    // ── Air Filters ──────────────────────────────────────────────────────

    'product-03-42776-010': [
        para('The 03-42776-010 is an OEM-specification engine air filter designed for Freightliner Cascadia trucks (2018–2025 model years) equipped with Cummins ISX/X15 or Detroit Diesel DD13, DD15, and DD16 engines. It provides the primary barrier between airborne contaminants and your engine\'s intake system.'),
        heading('Key Features'),
        bullet('Panel-style element measuring 25.5" × 7.5" × 9.2" for factory-exact fitment'),
        bullet('High-capacity pleated media captures dust, dirt, and debris down to 5 microns'),
        bullet('Rigid frame maintains structural integrity under high airflow and vibration'),
        bullet('Tool-free installation — typically completes in under 5 minutes'),
        heading('Maximize Engine Performance'),
        para('A restricted or clogged air filter forces the engine to work harder to draw in air, leading to incomplete combustion, increased fuel consumption, and accelerated turbocharger wear. Regular replacement at 10,000–15,000 mile intervals ensures optimal airflow, peak horsepower, and the best possible fuel economy for your Cascadia.'),
        heading('Vehicle Compatibility'),
        para('Direct fit for all Freightliner Cascadia trucks from 2018 through 2025. Cross-references to Donaldson P628541 and alternate Freightliner part number 03-42086-010.'),
    ],

    'product-21715813': [
        para('The 21715813 is a primary engine air filter engineered for Volvo VNL, VNM, VNR, and VHD heavy-duty trucks. Constructed with premium Italian-sourced filtration media, it provides 99% particle capture efficiency to shield turbochargers, cylinders, and pistons from abrasive airborne contaminants.'),
        heading('Key Features'),
        bullet('Radial seal design — 13" OD × 19.5" height for precise OEM fitment'),
        bullet('99% filtration efficiency for maximum engine protection'),
        bullet('High dust-holding capacity extends service life between replacements'),
        bullet('Expanded outer screen cage ensures rigidity and prevents media collapse'),
        heading('Why Air Filtration Quality Matters'),
        para('Diesel engines ingest thousands of cubic feet of air per hour. Without effective filtration, microscopic dust and sand particles act as an abrasive compound inside the engine — scoring cylinder walls, eroding piston rings, and shortening turbocharger life. Replacing your air filter every 12,000–15,000 miles is one of the most cost-effective ways to protect your engine investment.'),
        heading('Vehicle Compatibility'),
        para('Direct replacement for Volvo VNL, VNM, VNR, and VHD trucks from 2004 and newer. Cross-references to Baldwin RS4642, WIX 49126, and Donaldson P606720.'),
    ],

    'product-af26163m': [
        para('The AF26163M is a primary engine air filter designed for Volvo trucks from 2004 and newer, including VNL, VNM, VNX, VHD, and VAH model lines. Engineered with advanced synthetic filtration media, it delivers exceptional dust-holding capacity and consistent airflow restriction throughout its service life.'),
        heading('Key Features'),
        bullet('Radial seal element — 13.03" OD × 19.36" height for factory-exact installation'),
        bullet('Synthetic media provides higher dust-holding capacity than standard cellulose'),
        bullet('Maintains low restriction even as contaminant loading increases'),
        bullet('Compatible with both Volvo D12/D13 and Cummins-powered configurations'),
        heading('Designed for the Long Haul'),
        para('Over-the-road trucks encounter widely varying air quality — from dusty construction zones to urban soot. The AF26163M is built with enough media surface area and pleat density to handle these extremes while maintaining the consistent, low-restriction airflow that modern electronically controlled diesel engines require for peak performance.'),
        heading('Vehicle Compatibility'),
        para('Fits Volvo VNL, VNM, VNX, VHD, and VAH trucks equipped with D12, D13, or Cummins ISX engines. Replaces Volvo OEM 20411815 and Fleetguard AF26472M.'),
    ],

    'product-af27879': [
        para('The AF27879 is a primary engine air filter engineered for Freightliner heavy-duty trucks. Its panel-style design and high-density filtration media deliver superior particulate capture while maintaining the low airflow restriction that modern turbocharged diesel engines demand for optimal combustion and fuel efficiency.'),
        heading('Key Features'),
        bullet('Panel element measuring 26.1" × 5.25" × 9.27" for direct OEM replacement'),
        bullet('Advanced filtration media captures fine dust and soot particles'),
        bullet('Rigid frame construction withstands high-vibration on-highway environments'),
        bullet('Quick tool-free installation — no modifications required'),
        heading('Protect Your Engine Investment'),
        para('Airborne contaminants are the leading cause of premature internal engine wear. Replacing the AF27879 at recommended intervals keeps combustion efficiency high, turbocharger performance consistent, and helps avoid the cascading damage that occurs when abrasive particles bypass a saturated filter element.'),
        heading('Vehicle Compatibility'),
        para('Direct fit for Freightliner Cascadia, Columbia, and Century trucks. Cross-references to Baldwin CA5790, WIX 49478, Donaldson P610260, and FRAM CA11249.'),
    ],

    'product-d371061': [
        para('The D371061 is a Paccar OEM engine air filter designed for the latest generation of Kenworth T680 and Peterbilt 579 trucks (2022 and newer). Manufactured with premium glass fiber filter paper, it provides high filtration efficiency and consistent performance across a wide range of operating conditions.'),
        heading('Key Features'),
        bullet('Engineered specifically for 2022+ Kenworth T680 and Peterbilt 579 platforms'),
        bullet('Premium glass fiber media delivers high particle capture efficiency'),
        bullet('Maintains structural integrity under extreme pressure differentials'),
        bullet('Maximum surface area design extends service life'),
        heading('OEM-Quality Performance'),
        para('As a direct Paccar replacement, the D371061 matches the exact dimensions, media specifications, and airflow characteristics of the factory-installed element. This ensures the engine\'s electronic control module receives the expected intake air volume for precise fuel metering and emissions compliance.'),
        heading('Vehicle Compatibility'),
        para('Direct fit for Kenworth T680 and Peterbilt 579 trucks from 2022 model year onward. Also referenced as D37-1061, D37-1037, and Donaldson DBA6329.'),
    ],

    'product-p611696': [
        para('The P611696 is a primary engine air filter designed for Kenworth heavy-duty trucks equipped with Paccar MX-13 and Cummins ISX engines. It delivers high-efficiency particulate filtration to protect turbochargers, intercoolers, and internal engine components from the damaging effects of airborne contaminants.'),
        heading('Key Features'),
        bullet('Engineered for Paccar MX-13 and Cummins ISX engine platforms'),
        bullet('High-capacity pleated media for extended service intervals'),
        bullet('Rigid construction prevents media collapse under high airflow'),
        bullet('Direct drop-in replacement — no housing modifications needed'),
        heading('Application & Fitment'),
        boldPara('Compatible Kenworth Models:'),
        bullet('Kenworth W990 (2020+)'),
        bullet('Kenworth T880 (2015–2020)'),
        bullet('Kenworth T800 (1999–2020)'),
        bullet('Kenworth T680 (2013–2016)'),
        bullet('Kenworth T660 (2008–2018)'),
        bullet('Kenworth W900 (1999–2020)'),
        para('Cross-references to WIX 49456, Fleetguard AF27688, NAPA 9456, Luber-Finer LAF6116, FRAM CA10738, and Carquest 83456.'),
    ],

    'product-p621725': [
        para('The P621725 is a PowerCore G2 engine air filter engineered for Kenworth T680, T800, T880 and Peterbilt 567 and 579 trucks. This advanced panel-style element uses Donaldson\'s proprietary PowerCore filtration technology to deliver high-efficiency air cleaning in a compact, easy-to-service package.'),
        heading('Key Features'),
        bullet('PowerCore G2 technology — ultra-fine fluted media channels for maximum surface area'),
        bullet('Compact dimensions (483 × 213 × 309 mm) reduce housing size requirements'),
        bullet('No inner filter element required — simplifies replacement and reduces parts cost'),
        bullet('Designed for both on-road and off-road heavy-duty environments'),
        heading('Next-Generation Filtration'),
        para('Unlike traditional radial seal filters, the PowerCore G2 design uses straight-through fluted media channels that capture contaminants along the entire length of the element. This architecture provides more filtration surface area per unit of volume, resulting in longer service life, lower restriction, and better overall engine protection.'),
        heading('Vehicle Compatibility'),
        para('Direct fit for Kenworth T680, T800, and T880 as well as Peterbilt 567 and 579 trucks. Cross-references to Baldwin PA32000 and WIX WA11058.'),
    ],

    // ── Kits ─────────────────────────────────────────────────────────────

    'product-kit--1': [
        para('This comprehensive engine filter kit bundles the essential oil and fuel filters for Volvo VNL trucks equipped with D12 and D13 engines. Pre-packaged for a complete scheduled maintenance service, it eliminates the hassle of sourcing individual filters and ensures every component of your lubrication and fuel system is refreshed in a single service stop.'),
        heading('Kit Includes'),
        bullet('1× Bypass Oil Filter 21707132 — secondary filtration for ultra-fine contaminant removal'),
        bullet('2× Long-Life Oil Filters 23658092 — primary full-flow engine oil filtration'),
        bullet('1× Fuel Filter 23920469 — secondary fuel filtration for injector protection'),
        heading('Why Buy a Kit?'),
        para('Purchasing filters as a bundled kit saves money compared to buying each filter individually and guarantees part compatibility. Keep a kit on the truck or in the shop so you are always ready for scheduled service intervals without delay.'),
        heading('Vehicle Compatibility'),
        para('Designed for Volvo VNL, VNM, and VHD trucks with D12 and D13 engines.'),
    ],

    'product-kit--2': [
        para('A complete fuel and oil filter change kit packaged for Volvo VNL trucks with D12 and D13 engines. This all-in-one bundle covers both the fuel system and lubrication system, giving you everything needed for a thorough scheduled maintenance service.'),
        heading('Kit Includes'),
        bullet('2× Oil Filters 23151592 — primary full-flow oil filtration'),
        bullet('1× Fuel Filter 23920469 — secondary fuel filtration'),
        bullet('1× Fuel Water Separator FS20313 — EleMax three-stage water removal'),
        heading('Save Time and Money'),
        para('Bundled kits are priced below the combined individual filter cost and ensure you always have matching, compatible filters on hand. Ideal for fleet operators who want to standardize maintenance across multiple Volvo trucks.'),
        heading('Vehicle Compatibility'),
        para('Designed for Volvo VNL, VNM, and VHD trucks equipped with D12 and D13 engines.'),
    ],

    'product-kit--3': [
        para('This oil filter change kit provides a convenient two-part solution for scheduled oil service on Volvo VNL trucks. It includes the bypass and primary long-life filters required for a complete oil filtration system refresh.'),
        heading('Kit Includes'),
        bullet('1× Bypass Oil Filter 21707132 — captures ultra-fine particles to polish the oil supply'),
        bullet('2× Long-Life Oil Filters 23658092 — primary full-flow filtration with extended intervals'),
        heading('Complete Oil System Coverage'),
        para('Running both the bypass and primary oil filters together provides two-stage filtration that significantly reduces engine wear compared to single-stage systems alone. This kit makes it easy to replace both stages at once, ensuring balanced filtration performance.'),
        heading('Vehicle Compatibility'),
        para('Fits Volvo VNL, VNM, and VHD trucks with D12 and D13 diesel engines.'),
    ],

    'product-kit--4': [
        para('The most comprehensive filter maintenance kit available for Volvo VNL trucks, covering oil, fuel, and water separation in a single package. Ideal for owner-operators and fleet managers who want to perform a full preventive maintenance service in one efficient shop visit.'),
        heading('Kit Includes'),
        bullet('1× Bypass Oil Filter 21707132 — secondary oil filtration'),
        bullet('2× Long-Life Oil Filters 23658092 — primary full-flow oil filtration'),
        bullet('1× Fuel Filter 23920469 — secondary fuel filtration'),
        bullet('1× Fuel Water Separator FS19765 — StrataPore water separation'),
        heading('Complete Engine Protection'),
        para('This four-filter kit covers every critical filtration point in the engine\'s oil and fuel systems. By replacing all filters at the same time, you ensure balanced system performance and eliminate the risk of a single worn-out filter undermining the protection provided by the others.'),
        heading('Vehicle Compatibility'),
        para('Designed for Volvo VNL trucks with D12 and D13 engines. Compatible with Volvo VNM and VHD platforms.'),
    ],

    'product-kit--5': [
        para('A purpose-built fuel and oil filter kit for Volvo VNL trucks, combining primary oil filtration with advanced fuel/water separation. This bundle streamlines your maintenance routine by providing the filters most frequently replaced together during scheduled fuel and oil system service.'),
        heading('Kit Includes'),
        bullet('2× Oil Filters 23151592 — primary full-flow engine oil filtration'),
        bullet('1× Fuel Water Separator FS20313 — EleMax three-stage water removal cartridge'),
        heading('Streamlined Maintenance'),
        para('Pre-packaged kits reduce procurement time, eliminate the risk of ordering incorrect parts, and offer a lower combined price than purchasing each filter individually. Keep one in the truck\'s side box for roadside service readiness.'),
        heading('Vehicle Compatibility'),
        para('Fits Volvo VNL, VNM, and VHD trucks equipped with D12 and D13 engines.'),
    ],

    'product-kit--6': [
        para('This fuel and oil filter change kit is tailored for Volvo VNL trucks, pairing primary oil filtration with secondary fuel filtration in a single, cost-effective package. Perfect for scheduled maintenance intervals where both the oil and fuel systems require attention.'),
        heading('Kit Includes'),
        bullet('2× Oil Filters 23151592 — primary full-flow engine oil filtration'),
        bullet('1× Fuel Filter 23920469 — secondary fuel filtration for injector protection'),
        heading('Value and Convenience'),
        para('Buying this pre-matched filter kit saves money over individual purchases and guarantees part compatibility. Each filter is brand new, in original packaging, and ready to install with standard tools.'),
        heading('Vehicle Compatibility'),
        para('Designed for Volvo VNL trucks with D11, D12, and D13 engines. Also compatible with Volvo VNM and VHD platforms.'),
    ],

    // ── Accessories ──────────────────────────────────────────────────────

    'product-red-lamp': [
        para('The TL 60250R is a heavy-duty oval LED stop/turn/tail lamp designed for commercial trucks, trailers, and fleet vehicles. Featuring 26 high-output red LEDs in an oval polycarbonate housing, it delivers bright, attention-commanding illumination for maximum road safety and regulatory compliance.'),
        heading('Key Features'),
        bullet('26 red LEDs with focused beam pattern for superior visibility'),
        bullet('Sealed polycarbonate construction — IP67-rated against moisture and contaminants'),
        bullet('Fit\'N Forget S.S. connection for vibration-proof electrical performance'),
        bullet('FMVSS 108, CMVSS 108, DOT, and SAE compliant'),
        bullet('Compact dimensions: 6.5" W × 2.32" H × 1.62" D'),
        heading('LED Advantages'),
        para('LED lamps draw significantly less current than incandescent bulbs, reducing load on the alternator and extending battery life. With no filament to break, they are virtually immune to shock and vibration — a critical advantage in heavy-duty trucking environments. Typical LED lifespan exceeds 50,000 hours.'),
        heading('Installation'),
        para('Mounts securely with a standard grommet (sold separately). Can be installed horizontally or vertically to suit your application. Operates on standard 12V vehicle electrical systems.'),
    ],

    'product-white-lamp': [
        para('The TL 6060C is a heavy-duty oval LED backup/utility lamp designed for commercial trucks and trailers. Its 24-diode array delivers a full-pattern white light output for maximum rearward visibility during reversing operations, loading dock maneuvers, and nighttime inspections.'),
        heading('Key Features'),
        bullet('24 white LEDs in a unique full-pattern array for broad, even illumination'),
        bullet('Epoxy-encapsulated electronics prevent damage from moisture and corrosion'),
        bullet('Standard right-angle connection for easy wiring integration'),
        bullet('Significantly lower current draw than incandescent alternatives'),
        bullet('Shock and vibration resistant — no filament to break'),
        heading('Durability & Efficiency'),
        para('The sealed epoxy-encapsulated design protects internal components from water intrusion, road salt, and chemical exposure. Lower power consumption reduces alternator load and frees electrical capacity for other vehicle systems. Two lamps are recommended for backup applications.'),
        heading('Installation'),
        para('Mounts with standard grommet hardware (sold separately). Can be positioned horizontally or vertically. Compatible with 12V electrical systems on all major truck brands.'),
    ],
}

async function main() {
    console.log('Updating product descriptions in Sanity...\n')

    let updated = 0
    let skipped = 0

    for (const [docId, blocks] of Object.entries(descriptions)) {
        try {
            console.log(`  PATCH ${docId}`)
            await client
                .patch(docId)
                .set({ description: blocks })
                .commit()
            updated++
        } catch (err: any) {
            console.error(`  ERROR ${docId}: ${err.message}`)
            skipped++
        }
    }

    console.log(`\nDone. Updated: ${updated}, Errors: ${skipped}`)
}

main().catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
})
