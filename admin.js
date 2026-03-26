// Products Data
let products = [];

// Load products from localStorage
function loadProducts() {
    const savedProducts = localStorage.getItem('eleganceProducts');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Default products
        products = [
            {
                id: 1,
                name: "Sac à main Élégance",
                price: 8900,
                image: "https://picsum.photos/id/20/400/400",
                badge: "Nouveau",
                rating: 4.8
            },
            {
                id: 2,
                name: "Montre Classique",
                price: 12500,
                image: "https://picsum.photos/id/82/400/400",
                badge: "Best-seller",
                rating: 4.9
            },
            {
                id: 3,
                name: "Parfum Premium",
                price: 4500,
                image: "https://picsum.photos/id/152/400/400",
                badge: "Promo",
                rating: 4.7
            },
            {
                id: 4,
                name: "Lunettes de soleil",
                price: 3200,
                image: "https://picsum.photos/id/96/400/400",
                badge: "Tendance",
                rating: 4.6
            },
            {
                id: 5,
                name: "Portefeuille cuir",
                price: 2800,
                image: "https://picsum.photos/id/133/400/400",
                badge: "Qualité",
                rating: 4.8
            },
            {
                id: 6,
                name: "Ceinture élégante",
                price: 1900,
                image: "https://picsum.photos/id/127/400/400",
                badge: "Promo",
                rating: 4.5
            }
        ];
        saveProducts();
    }
    updateStats();
    renderProductsTable();
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('eleganceProducts', JSON.stringify(products));
    // Also update the frontend if it's open
    localStorage.setItem('productsUpdated', Date.now());
}

// Update statistics
function updateStats() {
    document.getElementById('totalProducts').textContent = products.length;
    
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('eleganceOrders') || '[]');
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => new Date(order.date).toDateString() === today);
    document.getElementById('todayOrders').textContent = todayOrders.length;
    
    const currentMonth = new Date().getMonth();
    const monthOrders = orders.filter(order => new Date(order.date).getMonth() === currentMonth);
    const monthRevenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
    document.getElementById('monthRevenue').textContent = monthRevenue.toLocaleString() + ' DA';
}

// Render products table
function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://picsum.photos/id/20/400/400'"></td>
            <td><strong>${product.name}</strong></td>
            <td>${product.price.toLocaleString()} DA</td>
            <td><span style="background: #e67e22; color: white; padding: 2px 8px; border-radius: 20px; font-size: 0.8rem;">${product.badge}</span></td>
            <td>${'⭐'.repeat(Math.floor(product.rating))} ${product.rating}</td>
            <td class="action-buttons">
                <button class="edit-btn" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Modifier
                </button>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </td>
        </tr>
    `).join('');
}

// Open add product modal
function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Ajouter un produit';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModal').classList.add('active');
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    document.getElementById('modalTitle').textContent = 'Modifier le produit';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productBadge').value = product.badge;
    document.getElementById('productRating').value = product.rating;
    document.getElementById('productModal').classList.add('active');
}

// Delete product
function deleteProduct(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        renderProductsTable();
        updateStats();
        showToast('Produit supprimé avec succès');
    }
}

// Save product (add or edit)
function saveProduct(event) {
    event.preventDefault();
    
    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const image = document.getElementById('productImage').value;
    const badge = document.getElementById('productBadge').value;
    const rating = parseFloat(document.getElementById('productRating').value);
    
    if (!name || !price || !image) {
        showToast('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    if (id) {
        // Edit existing product
        const index = products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            products[index] = { ...products[index], name, price, image, badge, rating };
        }
        showToast('Produit modifié avec succès');
    } else {
        // Add new product
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        products.push({
            id: newId,
            name,
            price,
            image,
            badge,
            rating
        });
        showToast('Produit ajouté avec succès');
    }
    
    saveProducts();
    renderProductsTable();
    updateStats();
    closeModal();
}

// Close modal
function closeModal() {
    document.getElementById('productModal').classList.remove('active');
}

// Export data
function exportData() {
    const data = {
        products: products,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `elegance_products_${new Date().toISOString().slice(0,19)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showToast('Données exportées avec succès');
}

// Import data
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const importedData = JSON.parse(event.target.result);
                if (importedData.products && Array.isArray(importedData.products)) {
                    products = importedData.products;
                    saveProducts();
                    renderProductsTable();
                    updateStats();
                    showToast('Données importées avec succès');
                } else {
                    showToast('Format de fichier invalide');
                }
            } catch (error) {
                showToast('Erreur lors de l\'importation');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toastMsg');
    if (!toast) return;
    
    const span = toast.querySelector('span');
    if (span) span.textContent = message;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Initialize admin panel
function init() {
    loadProducts();
    setupEventListeners();
    
    // Check for updates from other tabs
    window.addEventListener('storage', (e) => {
        if (e.key === 'productsUpdated') {
            loadProducts();
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    const form = document.getElementById('productForm');
    if (form) {
        form.addEventListener('submit', saveProduct);
    }
    
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', init);