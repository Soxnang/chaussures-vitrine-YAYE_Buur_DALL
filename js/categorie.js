// Données des produits
const productsData = [
    // Sandales
    { id: 1, name: "Sandales Dorées à Talon", category: "sandales", price: 89.99, color: "doré", size: ["36", "37", "38"], image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", description: "Sandales élégantes avec talon moyen et finition dorée." },
    { id: 2, name: "Sandales Plates en Cuir", category: "sandales", price: 65.99, color: "noir", size: ["37", "38", "39"], image: "https://images.unsplash.com/photo-1581101767113-1677dccc7f35?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", description: "Sandales confortables en cuir véritable." },
    { id: 3, name: "Sandales de Plage Tressées", category: "sandales", price: 49.99, color: "beige", size: ["36", "37", "38"], image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", description: "Sandales légères et résistantes à l'eau." },
    
    // Nu-pieds
    { id: 4, name: "Nu-pieds Argentés", category: "nu-pieds", price: 65.99, color: "argent", size: ["36", "37", "38"], image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", description: "Design minimaliste avec strass." },
    { id: 5, name: "Nu-pieds Dorés", category: "nu-pieds", price: 75.99, color: "doré", size: ["37", "38", "39"], image: "https://images.unsplash.com/photo-1606760227091-3dd870d974b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", description: "Élégants nu-pieds à brides fines." },
    
    // Talons
    { id: 6, name: "Talons Hauts Classiques", category: "talons", price: 129.99, color: "noir", size: ["37", "38", "39"], image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", description: "Talons 10cm en cuir verni." },
    { id: 7, name: "Escarpins Rouge Passion", category: "talons", price: 119.99, color: "rouge", size: ["36", "37", "38"], image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", description: "Escarpins à talon aiguille." },
    
];

// Variables globales
let currentProducts = [...productsData];
let currentSort = 'default';
let currentView = 'grid';
let activeFilters = {
    categories: ['sandales', 'nu-pieds', 'talons', 'baskets', 'bottes'],
    priceRange: 300,
    colors: [],
    sizes: []
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Charger les produits
    loadProducts();
    
    // Configurer les filtres
    setupFilters();
    
    // Configurer le tri
    setupSorting();
    
    // Configurer la vue
    setupViewToggle();
    
    // Configurer la pagination
    setupPagination();
    
    // Configurer FAQ si présente
    setupFAQ();
});

// Charger les produits
function loadProducts() {
    const productsContainer = document.getElementById('productsContainer');
    if (!productsContainer) return;
    
    // Filtrer les produits
    let filteredProducts = filterProducts();
    
    // Trier les produits
    filteredProducts = sortProducts(filteredProducts);
    
    // Mettre à jour le compteur
    updateResultsCount(filteredProducts.length);
    
    // Effacer le contenu existant
    productsContainer.innerHTML = '';
    
    // Ajouter les produits
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
    
    // Appliquer la vue actuelle
    applyCurrentView();
}

// Créer une carte produit
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-footer">
                <span class="price">${product.price.toFixed(2)}€</span>
                <div class="product-actions">
                    <button class="btn-wishlist"><i class="far fa-heart"></i></button>
                    <button class="btn-add-cart" data-id="${product.id}">Ajouter</button>
                </div>
            </div>
        </div>
    `;
    
    // Ajouter des écouteurs d'événements
    const addToCartBtn = card.querySelector('.btn-add-cart');
    addToCartBtn.addEventListener('click', function() {
        addToCart(product.id);
    });
    
    const wishlistBtn = card.querySelector('.btn-wishlist');
    wishlistBtn.addEventListener('click', function() {
        toggleWishlist(product.id, this);
    });
    
    return card;
}

// Filtrer les produits
function filterProducts() {
    return productsData.filter(product => {
        // Filtrer par catégorie
        if (activeFilters.categories.length > 0 && !activeFilters.categories.includes(product.category)) {
            return false;
        }
        
        // Filtrer par prix
        if (product.price > activeFilters.priceRange) {
            return false;
        }
        
        // Filtrer par couleur
        if (activeFilters.colors.length > 0 && !activeFilters.colors.includes(product.color)) {
            return false;
        }
        
        // Filtrer par taille (simplifié)
        if (activeFilters.sizes.length > 0) {
            const hasSize = activeFilters.sizes.some(size => product.size.includes(size));
            if (!hasSize) return false;
        }
        
        return true;
    });
}

// Trier les produits
function sortProducts(products) {
    switch(currentSort) {
        case 'price-asc':
            return [...products].sort((a, b) => a.price - b.price);
        case 'price-desc':
            return [...products].sort((a, b) => b.price - a.price);
        case 'newest':
            return [...products].sort((a, b) => b.id - a.id);
        case 'popular':
            // Simuler la popularité (pour l'exemple)
            return [...products].sort((a, b) => (b.id % 3) - (a.id % 3));
        default:
            return products;
    }
}

// Configurer les filtres
function setupFilters() {
    // Filtres de catégorie
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const category = this.value;
            if (this.checked) {
                if (!activeFilters.categories.includes(category)) {
                    activeFilters.categories.push(category);
                }
            } else {
                activeFilters.categories = activeFilters.categories.filter(c => c !== category);
            }
            loadProducts();
        });
    });
    
    // Filtre de prix
    const priceSlider = document.querySelector('.price-slider');
    const priceValue = document.getElementById('priceValue');
    
    if (priceSlider && priceValue) {
        priceSlider.addEventListener('input', function() {
            activeFilters.priceRange = parseInt(this.value);
            priceValue.textContent = `${this.value}€`;
            loadProducts();
        });
    }
    
    // Filtres de couleur
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            this.classList.toggle('active');
            const color = this.dataset.color;
            
            if (this.classList.contains('active')) {
                if (!activeFilters.colors.includes(color)) {
                    activeFilters.colors.push(color);
                }
            } else {
                activeFilters.colors = activeFilters.colors.filter(c => c !== color);
            }
            loadProducts();
        });
    });
    
    // Filtres de taille
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            this.classList.toggle('active');
            const size = this.textContent;
            
            if (this.classList.contains('active')) {
                if (!activeFilters.sizes.includes(size)) {
                    activeFilters.sizes.push(size);
                }
            } else {
                activeFilters.sizes = activeFilters.sizes.filter(s => s !== size);
            }
            loadProducts();
        });
    });
    
    // Effacer tous les filtres
    const clearFiltersBtn = document.querySelector('.clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            // Réinitialiser les filtres
            activeFilters = {
                categories: ['sandales', 'nu-pieds', 'talons', 'baskets', 'bottes'],
                priceRange: 300,
                colors: [],
                sizes: []
            };
            
            // Réinitialiser l'interface
            categoryCheckboxes.forEach(checkbox => checkbox.checked = true);
            
            if (priceSlider) {
                priceSlider.value = 300;
                if (priceValue) priceValue.textContent = '300€';
            }
            
            colorOptions.forEach(option => option.classList.remove('active'));
            sizeOptions.forEach(option => option.classList.remove('active'));
            
            loadProducts();
        });
    }
}

// Configurer le tri
function setupSorting() {
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            loadProducts();
        });
    }
    
    const categorySort = document.querySelector('.category-sort');
    if (categorySort) {
        categorySort.addEventListener('change', function() {
            currentSort = this.value;
            loadProducts();
        });
    }
}

// Configurer le toggle de vue
function setupViewToggle() {
    const viewOptions = document.querySelectorAll('.view-option');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    // Pour le catalogue
    viewOptions.forEach(option => {
        option.addEventListener('click', function() {
            viewOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            currentView = this.dataset.view;
            applyCurrentView();
        });
    });
    
    // Pour les catégories
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentView = this.dataset.view;
            applyCurrentView();
        });
    });
}

// Appliquer la vue actuelle
function applyCurrentView() {
    const productsContainer = document.getElementById('productsContainer');
    if (!productsContainer) return;
    
    if (currentView === 'list') {
        productsContainer.classList.add('list');
        productsContainer.classList.remove('grid');
    } else {
        productsContainer.classList.add('grid');
        productsContainer.classList.remove('list');
    }
}

// Configurer la pagination
function setupPagination() {
    // Simuler la pagination (pour l'exemple)
    const paginationNumbers = document.querySelectorAll('.pagination-number');
    paginationNumbers.forEach(number => {
        number.addEventListener('click', function() {
            paginationNumbers.forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            // Ici, vous chargeriez la page correspondante
        });
    });
    
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('disabled')) return;
            // Ici, vous iriez à la page suivante/précédente
        });
    });
}

// Mettre à jour le compteur de résultats
function updateResultsCount(count) {
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        resultsCount.textContent = `${count} produits trouvés`;
    }
}

// Gestion du panier (simplifiée)
function addToCart(productId) {
    // Récupérer le panier existant
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Vérifier si le produit est déjà dans le panier
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    // Sauvegarder le panier
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Mettre à jour le compteur
    updateCartCount();
    
    // Afficher une notification
    showNotification('Produit ajouté au panier !');
}

// Mettre à jour le compteur du panier
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Basculer la wishlist
function toggleWishlist(productId, button) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const icon = button.querySelector('i');
    
    if (wishlist.includes(productId)) {
        // Retirer de la wishlist
        wishlist = wishlist.filter(id => id !== productId);
        icon.classList.remove('fas');
        icon.classList.add('far');
        showNotification('Retiré de la wishlist');
    } else {
        // Ajouter à la wishlist
        wishlist.push(productId);
        icon.classList.remove('far');
        icon.classList.add('fas');
        showNotification('Ajouté à la wishlist');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Afficher une notification
function showNotification(message) {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--secondary-color);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
    `;
    
    // Ajouter au document
    document.body.appendChild(notification);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Configurer FAQ
function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Fermer toutes les autres réponses
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.classList.remove('active');
                    q.nextElementSibling.classList.remove('open');
                }
            });
            
            // Basculer la réponse actuelle
            this.classList.toggle('active');
            answer.classList.toggle('open');
            
            // Animer l'icône
            icon.style.transform = this.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
        });
    });
}

// Initialiser le compteur du panier au chargement
updateCartCount();

// Ajouter des styles d'animation pour les notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);