import { create } from 'zustand'

const useStore = create((set) => ({
    // Auth
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,

    login: (user, token) => {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        set({ user, token })
    },

    logout: () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        set({ user: null, token: null })
    },

    // Cart
    cart: JSON.parse(localStorage.getItem('cart')) || [],

    addToCart: (book, quantity = 1) => {
        set((state) => {
            const existing = state.cart.find(item => item.id === book.id)
            let newCart

            if (existing) {
                newCart = state.cart.map(item =>
                    item.id === book.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            } else {
                newCart = [...state.cart, { ...book, quantity }]
            }

            localStorage.setItem('cart', JSON.stringify(newCart))
            return { cart: newCart }
        })
    },

    removeFromCart: (id) => {
        set((state) => {
            const newCart = state.cart.filter(item => item.id !== id)
            localStorage.setItem('cart', JSON.stringify(newCart))
            return { cart: newCart }
        })
    },

    updateQuantity: (id, quantity) => {
        set((state) => {
            const newCart = state.cart.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
            localStorage.setItem('cart', JSON.stringify(newCart))
            return { cart: newCart }
        })
    },

    clearCart: () => {
        localStorage.removeItem('cart')
        set({ cart: [] })
    }
}))

export default useStore