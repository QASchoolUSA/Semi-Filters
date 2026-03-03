'use client'

import React, { useState } from 'react'
import { HiOutlinePhone, HiOutlineMail, HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi'
import toast from 'react-hot-toast'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    })
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1000))
        toast.success('Message sent! We\'ll get back to you within 24 hours.')
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
        setSubmitting(false)
    }

    return (
        <>
            <div className="page-header">
                <h1>Contact Us</h1>
                <p>Have a question? We&apos;re here to help you find the right filter.</p>
            </div>
            <section className="section">
                <div className="container">
                    <div className="contact-grid">
                        {/* Form */}
                        <div>
                            <h2 className="contact-form-heading">Send us a Message</h2>
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name *</label>
                                        <input
                                            id="name"
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="John Smith"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email *</label>
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="phone">Phone</label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="subject">Subject *</label>
                                        <select
                                            id="subject"
                                            required
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        >
                                            <option value="">Select a topic</option>
                                            <option value="product-inquiry">Product Inquiry</option>
                                            <option value="order-support">Order Support</option>
                                            <option value="bulk-pricing">Bulk / Fleet Pricing</option>
                                            <option value="compatibility">Compatibility Question</option>
                                            <option value="returns">Returns &amp; Warranty</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Message *</label>
                                    <textarea
                                        id="message"
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Tell us about your truck make, model, and year, or describe your question..."
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                                    {submitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <div className="contact-info-card">
                                <h3>Get in Touch</h3>
                                <div className="contact-info-item">
                                    <div className="contact-info-icon">
                                        <HiOutlinePhone size={22} />
                                    </div>
                                    <div className="contact-info-text">
                                        <h4>Phone</h4>
                                        <p>(555) 123-4567</p>
                                    </div>
                                </div>
                                <div className="contact-info-item">
                                    <div className="contact-info-icon">
                                        <HiOutlineMail size={22} />
                                    </div>
                                    <div className="contact-info-text">
                                        <h4>Email</h4>
                                        <p>contact@semifilters.com</p>
                                    </div>
                                </div>
                                <div className="contact-info-item">
                                    <div className="contact-info-icon">
                                        <HiOutlineLocationMarker size={22} />
                                    </div>
                                    <div className="contact-info-text">
                                        <h4>Address</h4>
                                        <p>Sanford, FL 32771</p>
                                    </div>
                                </div>
                                <div className="contact-info-item">
                                    <div className="contact-info-icon">
                                        <HiOutlineClock size={22} />
                                    </div>
                                    <div className="contact-info-text">
                                        <h4>Business Hours</h4>
                                        <p>Mon-Fri: 7:00 AM - 6:00 PM CST<br />Sat: 8:00 AM - 2:00 PM CST</p>
                                    </div>
                                </div>
                            </div>

                            <div className="contact-info-card contact-fleet-card">
                                <h3>Fleet Operators</h3>
                                <p className="contact-fleet-text">
                                    Managing a fleet? We offer volume discounts, dedicated account managers, and scheduled
                                    delivery programs. Contact us for a custom quote.
                                </p>
                                <button className="btn btn-outline contact-fleet-btn">
                                    Request Fleet Pricing
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
