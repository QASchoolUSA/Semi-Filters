import React from 'react'

export interface FaqItem {
    question: string
    answer: string
}

interface FaqSectionProps {
    title?: string
    faqs: FaqItem[]
    id?: string
}

export default function FaqSection({ title = 'Frequently Asked Questions', faqs, id = 'faq' }: FaqSectionProps) {
    if (!faqs.length) return null

    return (
        <section className="faq-section" id={id} aria-labelledby={`${id}-heading`}>
            <h2 id={`${id}-heading`} className="faq-section__title">{title}</h2>
            <div className="faq-section__list">
                {faqs.map((faq, index) => (
                    <details key={index} className="faq-item" open={index === 0}>
                        <summary className="faq-item__question">{faq.question}</summary>
                        <div className="faq-item__answer">
                            <p>{faq.answer}</p>
                        </div>
                    </details>
                ))}
            </div>
        </section>
    )
}
