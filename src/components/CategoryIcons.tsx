import React from 'react'

// Unique SVG icons for each filter category
// Used in CategoryCard, HomeClient, and anywhere category icons are needed

export function OilFilterIcon({ size = 48, className }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            {/* Oil filter canister */}
            <rect x="18" y="12" width="28" height="40" rx="4" stroke="currentColor" strokeWidth="2" />
            <rect x="22" y="8" width="20" height="6" rx="2" stroke="currentColor" strokeWidth="2" />
            {/* Gasket ring */}
            <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
            <circle cx="32" cy="32" r="3" fill="currentColor" opacity="0.4" />
            {/* Thread lines */}
            <line x1="22" y1="16" x2="42" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <line x1="22" y1="19" x2="42" y2="19" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            {/* Droplet */}
            <path d="M48 44 C48 44, 52 50, 52 52 C52 54.2 50.2 56 48 56 C45.8 56 44 54.2 44 52 C44 50 48 44 48 44Z" fill="currentColor" opacity="0.3" />
        </svg>
    )
}

export function AirFilterIcon({ size = 48, className }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            {/* Outer frame */}
            <rect x="10" y="16" width="44" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
            {/* Pleated filter lines */}
            <line x1="18" y1="20" x2="18" y2="44" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <line x1="24" y1="20" x2="24" y2="44" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <line x1="30" y1="20" x2="30" y2="44" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <line x1="36" y1="20" x2="36" y2="44" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <line x1="42" y1="20" x2="42" y2="44" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <line x1="48" y1="20" x2="48" y2="44" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            {/* Airflow arrows */}
            <path d="M4 28 L10 32 L4 36" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            <path d="M60 28 L54 32 L60 36" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            {/* Center badge */}
            <circle cx="32" cy="32" r="5" fill="currentColor" opacity="0.2" />
        </svg>
    )
}

export function FuelFilterIcon({ size = 48, className }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            {/* Fuel filter body - cylindrical */}
            <rect x="20" y="8" width="24" height="44" rx="6" stroke="currentColor" strokeWidth="2" />
            {/* Inlet/outlet ports */}
            <rect x="14" y="18" width="8" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <rect x="42" y="18" width="8" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
            {/* Internal separator lines */}
            <line x1="24" y1="28" x2="40" y2="28" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <line x1="24" y1="34" x2="40" y2="34" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <line x1="24" y1="40" x2="40" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            {/* Water drain valve */}
            <rect x="29" y="52" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <line x1="32" y1="56" x2="32" y2="60" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            {/* Water droplets */}
            <circle cx="30" cy="60" r="1.5" fill="currentColor" opacity="0.3" />
            <circle cx="34" cy="62" r="1" fill="currentColor" opacity="0.2" />
        </svg>
    )
}

export function CabinFilterIcon({ size = 48, className }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            {/* Filter panel */}
            <rect x="12" y="14" width="40" height="36" rx="3" stroke="currentColor" strokeWidth="2" />
            {/* Grid pattern */}
            <line x1="12" y1="24" x2="52" y2="24" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <line x1="12" y1="34" x2="52" y2="34" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <line x1="12" y1="44" x2="52" y2="44" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <line x1="24" y1="14" x2="24" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <line x1="36" y1="14" x2="36" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            {/* Clean air sparkles */}
            <circle cx="8" cy="20" r="1.5" fill="currentColor" opacity="0.3" />
            <circle cx="6" cy="32" r="1" fill="currentColor" opacity="0.2" />
            <circle cx="9" cy="42" r="1.5" fill="currentColor" opacity="0.3" />
            {/* Wind direction */}
            <path d="M54 26 C58 26, 58 30, 56 30" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            <path d="M54 34 C60 34, 60 40, 56 40" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        </svg>
    )
}

export function HydraulicFilterIcon({ size = 48, className }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            {/* Hydraulic filter housing */}
            <rect x="16" y="10" width="32" height="44" rx="5" stroke="currentColor" strokeWidth="2" />
            {/* Pressure gauge top */}
            <circle cx="32" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
            <line x1="32" y1="4" x2="34" y2="6" stroke="currentColor" strokeWidth="1" />
            {/* Filter element inside */}
            <rect x="22" y="18" width="20" height="28" rx="2" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.5" />
            <circle cx="32" cy="32" r="5" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
            <circle cx="32" cy="32" r="2" fill="currentColor" opacity="0.3" />
            {/* Hydraulic lines */}
            <line x1="10" y1="24" x2="16" y2="24" stroke="currentColor" strokeWidth="2" opacity="0.5" />
            <line x1="48" y1="38" x2="54" y2="38" stroke="currentColor" strokeWidth="2" opacity="0.5" />
        </svg>
    )
}

// Map category slugs to their icon components
export function getCategoryIcon(slug: string, size = 48): React.ReactNode {
    switch (slug) {
        case 'oil-filters':
            return <OilFilterIcon size={size} />
        case 'air-filters':
            return <AirFilterIcon size={size} />
        case 'fuel-filters':
            return <FuelFilterIcon size={size} />
        case 'cabin-filters':
            return <CabinFilterIcon size={size} />
        default:
            return <HydraulicFilterIcon size={size} />
    }
}
