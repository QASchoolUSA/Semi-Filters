export default function ProductDetailLoading() {
    return (
        <section className="section">
            <div className="container">
                {/* Breadcrumb */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                    <div className="sk" style={{ width: 50, height: 14 }} />
                    <div className="sk" style={{ width: 10, height: 14 }} />
                    <div className="sk" style={{ width: 40, height: 14 }} />
                    <div className="sk" style={{ width: 10, height: 14 }} />
                    <div className="sk" style={{ width: 120, height: 14 }} />
                </div>

                {/* Product Detail */}
                <div className="sk-detail">
                    <div>
                        <div className="sk sk-detail__image" />
                        <div className="sk-detail__thumbs" style={{ marginTop: 12 }}>
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="sk sk-detail__thumb" />
                            ))}
                        </div>
                    </div>

                    <div className="sk-detail__info">
                        <div className="sk" style={{ width: 100, height: 14 }} />
                        <div className="sk" style={{ width: '80%', height: 36 }} />
                        <div className="sk" style={{ width: 140, height: 14 }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div className="sk" style={{ width: 90, height: 32 }} />
                            <div className="sk" style={{ width: 70, height: 22 }} />
                        </div>
                        <div className="sk" style={{ width: '100%', height: 16 }} />
                        <div className="sk" style={{ width: '95%', height: 16 }} />
                        <div className="sk" style={{ width: '70%', height: 16 }} />
                        <div className="sk-detail__actions">
                            <div className="sk" style={{ flex: 1, height: 52, borderRadius: 10 }} />
                            <div className="sk" style={{ width: 130, height: 52, borderRadius: 10 }} />
                        </div>
                        <div className="sk" style={{ width: '100%', height: 1, margin: '8px 0', opacity: 0.5 }} />
                        <div className="sk" style={{ width: '100%', height: 48 }} />
                        <div className="sk" style={{ width: '100%', height: 48 }} />
                        <div className="sk" style={{ width: '100%', height: 48 }} />
                    </div>
                </div>

                {/* Related Products */}
                <div style={{ marginTop: 64 }}>
                    <div className="sk-section__header">
                        <div className="sk" style={{ width: 160, height: 28 }} />
                        <div className="sk" style={{ width: 280, height: 16 }} />
                    </div>
                    <div className="sk-grid">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="sk-product-card">
                                <div className="sk sk-product-card__image" />
                                <div className="sk-product-card__body">
                                    <div className="sk" style={{ width: '55%', height: 12 }} />
                                    <div className="sk" style={{ width: '85%', height: 16 }} />
                                    <div className="sk" style={{ width: '30%', height: 20 }} />
                                </div>
                                <div className="sk sk-product-card__btn" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
