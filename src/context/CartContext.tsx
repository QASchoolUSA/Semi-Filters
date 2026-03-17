'use client'

import React, { createContext, useContext, useReducer, useEffect, useState, useCallback, ReactNode } from 'react'
import toast from 'react-hot-toast'
import type { CartItem } from '@/types'

export type { CartItem }

interface CartState {
    items: CartItem[]
    totalItems: number
    totalPrice: number
}

type CartAction =
    | { type: 'ADD_TO_CART'; payload: CartItem }
    | { type: 'REMOVE_FROM_CART'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'LOAD_CART'; payload: CartItem[] }

interface CartContextType extends CartState {
    addToCart: (item: CartItem) => void
    removeFromCart: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    isCartOpen: boolean
    openCart: () => void
    closeCart: () => void
    toggleCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function calculateTotals(items: CartItem[]) {
    return {
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }
}

function cartReducer(state: CartState, action: CartAction): CartState {
    let newItems: CartItem[]

    switch (action.type) {
        case 'ADD_TO_CART': {
            const existingIndex = state.items.findIndex((item) => item._id === action.payload._id)
            if (existingIndex > -1) {
                newItems = state.items.map((item, index) =>
                    index === existingIndex
                        ? { ...item, quantity: item.quantity + action.payload.quantity }
                        : item
                )
            } else {
                newItems = [...state.items, action.payload]
            }
            return { items: newItems, ...calculateTotals(newItems) }
        }
        case 'REMOVE_FROM_CART':
            newItems = state.items.filter((item) => item._id !== action.payload)
            return { items: newItems, ...calculateTotals(newItems) }
        case 'UPDATE_QUANTITY':
            newItems = state.items
                .map((item) =>
                    item._id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
                .filter((item) => item.quantity > 0)
            return { items: newItems, ...calculateTotals(newItems) }
        case 'CLEAR_CART':
            return { items: [], totalItems: 0, totalPrice: 0 }
        case 'LOAD_CART':
            return { items: action.payload, ...calculateTotals(action.payload) }
        default:
            return state
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, {
        items: [],
        totalItems: 0,
        totalPrice: 0,
    })

    const [isCartOpen, setIsCartOpen] = useState(false)

    const openCart = useCallback(() => setIsCartOpen(true), [])
    const closeCart = useCallback(() => setIsCartOpen(false), [])
    const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), [])

    // Lock body scroll when cart drawer is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isCartOpen])

    // Load cart from localStorage on mount and sync slugs with Sanity
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('semi-filters-cart')
            if (savedCart) {
                const items: CartItem[] = JSON.parse(savedCart)
                dispatch({ type: 'LOAD_CART', payload: items })

                if (items.length > 0) {
                    const ids = items.map((item) => item._id)
                    fetch('/api/product-slugs', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ids }),
                    })
                        .then((res) => res.json())
                        .then(({ slugs }: { slugs: Record<string, string> }) => {
                            const updated = items.map((item) =>
                                slugs[item._id] && slugs[item._id] !== item.slug
                                    ? { ...item, slug: slugs[item._id] }
                                    : item
                            )
                            if (updated.some((item, i) => item.slug !== items[i].slug)) {
                                dispatch({ type: 'LOAD_CART', payload: updated })
                            }
                        })
                        .catch(() => {})
                }
            }
        } catch (error) {
            console.error('Failed to load cart:', error)
        }
    }, [])

    // Save cart to localStorage on change
    useEffect(() => {
        try {
            localStorage.setItem('semi-filters-cart', JSON.stringify(state.items))
        } catch (error) {
            console.error('Failed to save cart:', error)
        }
    }, [state.items])

    const addToCart = (item: CartItem) => {
        dispatch({ type: 'ADD_TO_CART', payload: item })
        toast.success(`${item.name} added to cart!`)
        openCart()
    }

    const removeFromCart = (id: string) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: id })
        toast.success('Item removed from cart')
    }

    const updateQuantity = (id: string, quantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    }

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' })
        toast.success('Cart cleared')
    }

    return (
        <CartContext.Provider
            value={{ ...state, addToCart, removeFromCart, updateQuantity, clearCart, isCartOpen, openCart, closeCart, toggleCart }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
