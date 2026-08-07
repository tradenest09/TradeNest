/**
 * Centralized helper to build the correct image URL regardless of whether 
 * it's a legacy static asset, a newly uploaded file, or an external URL.
 */
export const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder.png";

    // External URLs (e.g., https://via.placeholder.com/150)
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("data:")) {
        return imageUrl;
    }

    // Legacy dummy data (e.g., "images/laptop.jpg")
    // These are typically served from the frontend public directory (e.g. /images/...)
    if (imageUrl.startsWith("images/")) {
        return `/${imageUrl}`;
    }

    // Newly uploaded images (UUID filenames like "550e8400-e29b-41d4-a716-446655440000.jpg")
    return `http://localhost:8080/uploads/products/${imageUrl}`;
};

/**
 * Image error handler to fall back to a placeholder gracefully.
 */
export const handleImageError = (e) => {
    // Prevent infinite loop if placeholder is also missing
    if (e.target.src.includes("placeholder")) return;
    
    // We can fallback to an empty source and let CSS/React handle the visual, 
    // or use a transparent pixel, or a static placeholder image.
    // In this case, we use a data URI for a generic 1x1 transparent image or just let it be handled by a fallback element.
    // For simplicity, we just clear the src so it doesn't show a broken image icon.
    e.target.style.display = 'none';
    
    // Create a fallback element
    const fallback = document.createElement('div');
    fallback.className = 'w-100 h-100 d-flex align-items-center justify-content-center bg-light';
    fallback.innerHTML = '<span style="font-size: 2rem;">📸</span>';
    
    if (e.target.parentNode) {
        e.target.parentNode.insertBefore(fallback, e.target);
    }
};
