export default function HomeLoading() {
    return (
        <>
            {/* Hero Skeleton */}
            <section className="sk-hero">
                <div className="sk-hero__bg" />
                <div className="sk-hero__content">
                    <div className="sk-hero__left">
                        <div className="sk" style={{ width: 120, height: 28, borderRadius: 9999 }} />
                        <div className="sk" style={{ width: '90%', height: 48 }} />
                        <div className="sk" style={{ width: '70%', height: 36 }} />
                        <div className="sk" style={{ width: '100%', height: 20 }} />
                        <div className="sk" style={{ width: '80%', height: 20 }} />
                        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                            <div className="sk" style={{ width: 160, height: 52, borderRadius: 16 }} />
                            <div className="sk" style={{ width: 160, height: 52, borderRadius: 16 }} />
                        </div>
                        <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
                            <div className="sk" style={{ width: 140, height: 16 }} />
                            <div className="sk" style={{ width: 140, height: 16 }} />
                        </div>
                    </div>
                    <div className="sk sk-hero__right" />
                </div>
                <div className="sk-hero__products">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="sk sk-hero__product-card" />
                    ))}
                </div>
            </section>

            {/* Categories Section Skeleton */}
            <section className="sk-section">
                <div className="sk-section__header">
                    <div className="sk" style={{ width: 100, height: 26, borderRadius: 9999 }} />
                    <div className="sk" style={{ width: 240, height: 32 }} />
                    <div className="sk" style={{ width: 340, height: 18 }} />
                </div>
                <div className="sk-grid sk-grid--categories">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="sk sk-category-card" />
                    ))}
                </div>
            </section>

            {/* Products Section Skeleton */}
            <section className="sk-section" style={{ background: 'var(--color-bg-secondary)' }}>
                <div className="sk-section__header">
                    <div className="sk" style={{ width: 90, height: 26, borderRadius: 9999 }} />
                    <div className="sk" style={{ width: 220, height: 32 }} />
                    <div className="sk" style={{ width: 380, height: 18 }} />
                </div>
                <div className="sk-grid">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="sk-product-card">
                            <div className="sk sk-product-card__image" />
                            <div className="sk-product-card__body">
                                <div className="sk" style={{ width: '60%', height: 12 }} />
                                <div className="sk" style={{ width: '90%', height: 16 }} />
                                <div className="sk" style={{ width: '40%', height: 12 }} />
                                <div className="sk" style={{ width: '35%', height: 20 }} />
                            </div>
                            <div className="sk sk-product-card__btn" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section Skeleton */}
            <section className="sk-section">
                <div className="sk-section__header">
                    <div className="sk" style={{ width: 120, height: 26, borderRadius: 9999 }} />
                    <div className="sk" style={{ width: 260, height: 32 }} />
                    <div className="sk" style={{ width: 360, height: 18 }} />
                </div>
                <div className="sk-grid sk-grid--features">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="sk sk-feature-card" />
                    ))}
                </div>
            </section>
        </>
    )
}
