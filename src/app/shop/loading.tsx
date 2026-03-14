export default function ShopLoading() {
    return (
        <>
            <div className="shop-page-title-banner">
                <div className="container">
                    <div className="sk" style={{ width: 200, height: 38 }} />
                </div>
            </div>
            <section className="section shop-section">
                <div className="container">
                    <div className="shop-layout">
                        {/* Category Chips Skeleton */}
                        <div className="sk-shop-chips">
                            {[70, 110, 100, 100, 120].map((w, i) => (
                                <div key={i} className="sk sk-chip" style={{ width: w }} />
                            ))}
                        </div>

                        {/* Toolbar Skeleton */}
                        <div className="sk sk-toolbar" />

                        {/* Product Grid Skeleton */}
                        <div className="product-grid">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="sk-product-card">
                                    <div className="sk sk-product-card__image" />
                                    <div className="sk-product-card__body">
                                        <div className="sk" style={{ width: '55%', height: 12 }} />
                                        <div className="sk" style={{ width: '85%', height: 16 }} />
                                        <div className="sk" style={{ width: '40%', height: 12 }} />
                                        <div className="sk" style={{ width: '30%', height: 20 }} />
                                    </div>
                                    <div className="sk sk-product-card__btn" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
