import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, ArrowLeft, Star, Pencil, Trash2, Check, X } from 'lucide-react'
import api from '../lib/api'
import useStore from '../store/useStore'


function StarRating({ rating }) {
    return (
        <div style={{ display: 'flex', gap: '0.2rem' }}>
            {[1, 2, 3, 4, 5].map(star => (
                <Star
                    key={star}
                    size={16}
                    fill={star <= rating ? '#C9A84C' : 'none'}
                    color={star <= rating ? '#C9A84C' : '#9CA3AF'}
                />
            ))}
        </div>
    )
}

function BookDetail() {
    const { id } = useParams()
    const [book, setBook] = useState(null)
    const [reviews, setReviews] = useState([])
    const [quantity, setQuantity] = useState(1)
    const [wishlisted, setWishlisted] = useState(false)
    const [loading, setLoading] = useState(true)
    const addToCart = useStore(state => state.addToCart)
    const [added, setAdded] = useState(false)
    const navigate = useNavigate()
    const user = useStore(state => state.user)
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
    const [submitting, setSubmitting] = useState(false)
    const [reviewError, setReviewError] = useState('')
    const [editingReviewId, setEditingReviewId] = useState(null)
    const [editReview, setEditReview] = useState({ rating: 5, comment: '' })

    const handleSubmitReview = async () => {
        if (!user) {
            navigate('/login')
            return
        }
        if (!newReview.comment) {
            setReviewError('Please write a comment!')
            return
        }
        try {
            setSubmitting(true)
            await api.post(`/reviews/${book.id}`, newReview)
            setNewReview({ rating: 5, comment: '' })
            setReviewError('')
            fetchBook()
        } catch (err) {
            setReviewError(err.response?.data?.message || 'Failed to submit review!')
        } finally {
            setSubmitting(false)
        }
    }

    const handleUpdateReview = async (reviewId) => {
        if (!editReview.comment) return
        try {
            setSubmitting(true)
            await api.put(`/reviews/${reviewId}`, editReview)
            setEditingReviewId(null)
            setEditReview({ rating: 5, comment: '' })
            fetchBook()
        } catch (err) {
            setReviewError(err.response?.data?.message || 'Failed to update review!')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return
        try {
            await api.delete(`/reviews/${reviewId}`)
            fetchBook()
        } catch (err) {
            console.error('Failed to delete review', err)
        }
    }

    const handleWishlist = async () => {
        if (!user) {
            navigate('/login')
            return
        }
        if (!book) return
        try {
            if (wishlisted) {
                await api.delete(`/wishlist/${book.id}`)
                setWishlisted(false)
            } else {
                await api.post(`/wishlist/${book.id}`)
                setWishlisted(true)
            }
        } catch (err) {
            // If server says "already in wishlist", sync state
            if (err.response?.status === 400) {
                setWishlisted(true)
            } else if (err.response?.status === 404) {
                setWishlisted(false)
            }
        }
    }

    const checkWishlist = async () => {
        if (!user) return
        try {
            const res = await api.get('/wishlist')
            const isWishlisted = res.data.some(item => String(item.bookId) === String(id))
            setWishlisted(isWishlisted)
        } catch (err) {
            console.error('Failed to check wishlist', err)
        }
    }


    useEffect(() => {
        window.scrollTo(0, 0)
        fetchBook()
        checkWishlist()
    }, [id])

    const fetchBook = async () => {
        try {
            setLoading(true)
            const res = await api.get(`/books/${id}`)
            setBook(res.data)
            document.title = `${res.data.title} | The Serene Scriptorium`
            setReviews(res.data.reviews || [])
        } catch (err) {
            console.error('Failed to fetch book', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F5F0E8',
            fontFamily: 'Pinyon Script, cursive',
            fontSize: '2.5rem',
            color: '#0F1F3D'
        }}>
            Loading...
        </div>
    )

    if (!book) return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F5F0E8',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.5rem',
            color: '#0F1F3D'
        }}>
            Book not found!
        </div>
    )

    return (
        <div style={{ backgroundColor: '#F5F0E8', minHeight: '100vh' }}>

            {/* Header */}
            <div style={{
                backgroundColor: '#0F1F3D',
                padding: '2rem 4rem',
                borderBottom: '2px solid #C9A84C'
            }}>
                <Link to="/browse" style={{
                    textDecoration: 'none',
                    color: '#C9A84C',
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1rem',
                    letterSpacing: '1px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <ArrowLeft size={16} />
                    Back to Collection
                </Link>
            </div>

            {/* Main Content */}
            <div style={{
                maxWidth: '1100px',
                margin: '0 auto',
                padding: '4rem 2rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1.5fr',
                gap: '4rem',
                alignItems: 'start'
            }}>

                {/* Book Cover */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <img
                        src={book.cover}
                        alt={book.title}
                        style={{
                            width: '100%',
                            borderRadius: '12px',
                            boxShadow: '0 0 0 3px #C9A84C, 0 20px 60px rgba(0,0,0,0.2)',
                            objectFit: 'cover',
                            maxHeight: '500px'
                        }}
                    />
                </motion.div>

                {/* Book Info */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Genre */}
                    <span style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '0.8rem',
                        letterSpacing: '3px',
                        color: '#8B0000',
                        textTransform: 'uppercase'
                    }}>{book.genre}</span>

                    {/* Title */}
                    <h1 style={{
                        fontFamily: 'Pinyon Script, cursive',
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        color: '#0F1F3D',
                        margin: '0.5rem 0',
                        lineHeight: '1.2'
                    }}>{book.title}</h1>

                    {/* Author */}
                    <p style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '1.2rem',
                        color: '#6b7280',
                        marginBottom: '1rem',
                        fontStyle: 'italic'
                    }}>by {book.author}</p>

                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                        <StarRating rating={4} />
                        <span style={{
                            fontFamily: 'EB Garamond, serif',
                            fontSize: '0.9rem',
                            color: '#6b7280'
                        }}>({reviews.length} reviews)</span>
                    </div>

                    {/* Divider */}
                    <div style={{ width: '60px', height: '2px', backgroundColor: '#C9A84C', marginBottom: '1.5rem' }} />

                    {/* Description */}
                    <p style={{
                        fontFamily: 'EB Garamond, serif',
                        fontSize: '1.1rem',
                        color: '#4a4a4a',
                        lineHeight: '1.9',
                        fontStyle: 'italic',
                        marginBottom: '2rem'
                    }}>{book.description}</p>

                    {/* Price */}
                    <p style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#C9A84C',
                        marginBottom: '1.5rem'
                    }}>₹{book.price}</p>

                    {/* Stock */}
                    <p style={{
                        fontFamily: 'EB Garamond, serif',
                        fontSize: '0.9rem',
                        color: book.stock > 0 ? '#1B4332' : '#8B0000',
                        marginBottom: '1.5rem'
                    }}>
                        {book.stock > 0 ? `✓ In Stock (${book.stock} available)` : '✗ Out of Stock'}
                    </p>

                    {/* Quantity */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <span style={{
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: '1rem',
                            letterSpacing: '1px',
                            color: '#0F1F3D'
                        }}>Quantity:</span>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1.5px solid #C9A84C',
                            borderRadius: '25px',
                            overflow: 'hidden'
                        }}>
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                padding: '0.4rem 1rem',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                color: '#0F1F3D'
                            }}>−</button>
                            <span style={{
                                padding: '0.4rem 1rem',
                                fontFamily: 'Cormorant Garamond, serif',
                                fontSize: '1rem',
                                color: '#0F1F3D',
                                borderLeft: '1px solid rgba(201,168,76,0.3)',
                                borderRight: '1px solid rgba(201,168,76,0.3)'
                            }}>{quantity}</span>
                            <button onClick={() => setQuantity(q => Math.min(book.stock, q + 1))} style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                padding: '0.4rem 1rem',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                color: '#0F1F3D'
                            }}>+</button>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => {
                                if (added) {
                                    navigate('/cart')
                                } else {
                                    addToCart(book, quantity)
                                    setAdded(true)
                                }
                            }}
                            style={{
                                backgroundColor: added ? '#1B4332' : '#0F1F3D',
                                color: '#F5F0E8',
                                border: 'none',
                                padding: '0.8rem 2rem',
                                borderRadius: '30px',
                                fontFamily: 'Cormorant Garamond, serif',
                                fontSize: '1rem',
                                letterSpacing: '1.5px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.3s ease'
                            }}>
                            {added ? (
                                <>🛒 Go to Cart</>
                            ) : (
                                <><ShoppingCart size={18} /> Add to Cart</>
                            )}
                        </button>

                        <button
                            onClick={handleWishlist}
                            style={{
                                backgroundColor: 'transparent',
                                border: '1.5px solid #C9A84C',
                                color: wishlisted ? '#8B0000' : '#0F1F3D',
                                padding: '0.8rem 1.5rem',
                                borderRadius: '30px',
                                fontFamily: 'Cormorant Garamond, serif',
                                fontSize: '1rem',
                                letterSpacing: '1.5px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                            <Heart size={18} fill={wishlisted ? '#8B0000' : 'none'} color={wishlisted ? '#8B0000' : '#0F1F3D'} />
                            {wishlisted ? 'Wishlisted' : 'Wishlist'}
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Reviews Section */}
            <div style={{
                backgroundColor: '#0F1F3D',
                padding: '4rem',
                borderTop: '2px solid #C9A84C'
            }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <h2 style={{
                        fontFamily: 'Pinyon Script, cursive',
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        color: '#F5F0E8',
                        marginBottom: '0.5rem'
                    }}>Reader Reviews</h2>
                    <div style={{ width: '60px', height: '2px', backgroundColor: '#C9A84C', marginBottom: '2.5rem' }} />

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {reviews.length > 0 ? reviews.map(review => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                style={{
                                    backgroundColor: 'rgba(245,240,232,0.05)',
                                    border: editingReviewId === review.id ? '1px solid #C9A84C' : '1px solid rgba(201,168,76,0.3)',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    transition: 'border-color 0.3s ease'
                                }}
                            >
                                {editingReviewId === review.id ? (
                                    /* Edit Mode */
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <span style={{
                                                fontFamily: 'Cormorant Garamond, serif',
                                                fontSize: '1rem',
                                                color: '#C9A84C',
                                                fontWeight: '600',
                                                letterSpacing: '1px'
                                            }}>Editing Review</span>
                                            <button
                                                onClick={() => { setEditingReviewId(null); setEditReview({ rating: 5, comment: '' }) }}
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#9CA3AF',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                        {/* Star Rating Editor */}
                                        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    size={22}
                                                    fill={star <= editReview.rating ? '#C9A84C' : 'none'}
                                                    color={star <= editReview.rating ? '#C9A84C' : '#9CA3AF'}
                                                    style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
                                                    onClick={() => setEditReview({ ...editReview, rating: star })}
                                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                                />
                                            ))}
                                        </div>
                                        {/* Comment Editor */}
                                        <textarea
                                            value={editReview.comment}
                                            onChange={e => setEditReview({ ...editReview, comment: e.target.value })}
                                            rows={3}
                                            style={{
                                                width: '100%',
                                                padding: '0.8rem 1rem',
                                                borderRadius: '8px',
                                                border: '1.5px solid rgba(201,168,76,0.3)',
                                                backgroundColor: 'rgba(245,240,232,0.05)',
                                                fontFamily: 'EB Garamond, serif',
                                                fontSize: '1rem',
                                                color: '#F5F0E8',
                                                outline: 'none',
                                                resize: 'vertical',
                                                boxSizing: 'border-box',
                                                marginBottom: '1rem'
                                            }}
                                            onFocus={e => e.target.style.borderColor = '#C9A84C'}
                                            onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'}
                                        />
                                        {/* Action Buttons */}
                                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                                            <button
                                                onClick={() => handleUpdateReview(review.id)}
                                                disabled={submitting}
                                                style={{
                                                    backgroundColor: '#C9A84C',
                                                    color: '#0F1F3D',
                                                    border: 'none',
                                                    padding: '0.5rem 1.5rem',
                                                    borderRadius: '20px',
                                                    fontFamily: 'Cormorant Garamond, serif',
                                                    fontSize: '0.9rem',
                                                    letterSpacing: '1px',
                                                    cursor: 'pointer',
                                                    fontWeight: '700',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <Check size={14} /> {submitting ? 'Saving...' : 'Save'}
                                            </button>
                                            <button
                                                onClick={() => { setEditingReviewId(null); setEditReview({ rating: 5, comment: '' }) }}
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    border: '1px solid rgba(201,168,76,0.3)',
                                                    color: '#D4C9B0',
                                                    padding: '0.5rem 1.5rem',
                                                    borderRadius: '20px',
                                                    fontFamily: 'Cormorant Garamond, serif',
                                                    fontSize: '0.9rem',
                                                    letterSpacing: '1px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Display Mode */
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                            <span style={{
                                                fontFamily: 'Cormorant Garamond, serif',
                                                fontSize: '1rem',
                                                color: '#F5F0E8',
                                                fontWeight: '600'
                                            }}>{review.user?.name || review.name}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                <span style={{
                                                    fontFamily: 'EB Garamond, serif',
                                                    fontSize: '0.85rem',
                                                    color: '#9CA3AF'
                                                }}>{review.date || new Date(review.createdAt).toLocaleDateString()}</span>
                                                {user && review.userId === user.id && (
                                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                        <button
                                                            onClick={() => {
                                                                setEditingReviewId(review.id)
                                                                setEditReview({ rating: review.rating, comment: review.comment })
                                                            }}
                                                            style={{
                                                                backgroundColor: 'transparent',
                                                                border: '1px solid rgba(201,168,76,0.25)',
                                                                borderRadius: '6px',
                                                                padding: '0.3rem',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                color: '#C9A84C',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.15)' }}
                                                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                                                            title="Edit review"
                                                        >
                                                            <Pencil size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteReview(review.id)}
                                                            style={{
                                                                backgroundColor: 'transparent',
                                                                border: '1px solid rgba(139,0,0,0.3)',
                                                                borderRadius: '6px',
                                                                padding: '0.3rem',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                color: '#8B0000',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(139,0,0,0.15)' }}
                                                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                                                            title="Delete review"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <StarRating rating={review.rating} />
                                        <p style={{
                                            fontFamily: 'EB Garamond, serif',
                                            fontSize: '1rem',
                                            color: '#D4C9B0',
                                            lineHeight: '1.7',
                                            fontStyle: 'italic',
                                            marginTop: '0.8rem'
                                        }}>{review.comment}</p>
                                    </>
                                )}
                            </motion.div>
                        )) : (
                            <p style={{
                                fontFamily: 'EB Garamond, serif',
                                fontSize: '1.1rem',
                                color: '#9CA3AF',
                                fontStyle: 'italic'
                            }}>No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                    {/* Add Review Form */}
                    {user && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            style={{
                                backgroundColor: 'rgba(245,240,232,0.05)',
                                border: '1px solid rgba(201,168,76,0.3)',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                marginTop: '2rem'
                            }}
                        >
                            <h3 style={{
                                fontFamily: 'Pinyon Script, cursive',
                                fontSize: '2rem',
                                color: '#F5F0E8',
                                marginBottom: '1.2rem'
                            }}>Write a Review</h3>

                            {/* Star Rating Selector */}
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        size={24}
                                        fill={star <= newReview.rating ? '#C9A84C' : 'none'}
                                        color={star <= newReview.rating ? '#C9A84C' : '#9CA3AF'}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                    />
                                ))}
                            </div>

                            {/* Comment */}
                            <textarea
                                value={newReview.comment}
                                onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                                placeholder="Share your thoughts about this book..."
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem',
                                    borderRadius: '8px',
                                    border: '1.5px solid rgba(201,168,76,0.3)',
                                    backgroundColor: 'rgba(245,240,232,0.05)',
                                    fontFamily: 'EB Garamond, serif',
                                    fontSize: '1rem',
                                    color: '#F5F0E8',
                                    outline: 'none',
                                    resize: 'vertical',
                                    boxSizing: 'border-box',
                                    marginBottom: '1rem'
                                }}
                                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'}
                            />

                            {reviewError && (
                                <p style={{
                                    fontFamily: 'EB Garamond, serif',
                                    fontSize: '0.95rem',
                                    color: '#8B0000',
                                    fontStyle: 'italic',
                                    marginBottom: '0.8rem'
                                }}>{reviewError}</p>
                            )}

                            <button
                                onClick={handleSubmitReview}
                                disabled={submitting}
                                style={{
                                    backgroundColor: '#C9A84C',
                                    color: '#0F1F3D',
                                    border: 'none',
                                    padding: '0.7rem 2rem',
                                    borderRadius: '25px',
                                    fontFamily: 'Cormorant Garamond, serif',
                                    fontSize: '1rem',
                                    letterSpacing: '1.5px',
                                    cursor: 'pointer',
                                    fontWeight: '700'
                                }}
                            >
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default BookDetail