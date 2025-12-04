const CART_KEY = "guestCart";

/**
 * Güvenli localStorage erişimi
 */
const safeLocalStorage = {
  get() {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
      return [];
    }
  },
  set(data) {
    if (typeof window === "undefined") return;
    localStorage.setItem(CART_KEY, JSON.stringify(data));
    // Sepet güncellendiğinde tüm uygulamayı bilgilendir
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  },
  remove() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  },
};

export const getCart = () => {
  return safeLocalStorage.get() || [];
};

export const saveCart = (cart) => {
  safeLocalStorage.set(cart);
};

/**
 * Misafir sepetine ürün ekleme
 */
export const addToGuestCart = (product, quantity = 1) => {
  const cart = getCart();

  // product.productId yerine bir ID alanı bul (örn: item.id)
  const idToMatch = product.productId;

  // Aynı ürünü bul
  const existing = cart.find((item) => item.productId === idToMatch);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      productId: idToMatch,
      title: product.title,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
      category: product.category,
      customName: product.customName,
      quantity,
    });
  }

  saveCart(cart);
};

/**
 * Miktar güncelleme – doğrudan yeni miktar ile
 * @param {string | number} productId - Güncellenecek ürünün ID'si
 * @param {number} newQuantity - Ürünün olması istenen yeni miktarı
 */
export const updateGuestCartQuantity = (productId, newQuantity) => {
  const cart = getCart();
  const item = cart.find((c) => c.productId === productId);

  if (!item) return;

  // Yeni miktarı ata, minimum 1 olacak şekilde sınırla
  item.quantity = Math.max(1, newQuantity);

  saveCart(cart);
};

/**
 * Ürün silme
 */
export const removeFromGuestCart = (productId) => {
  const newCart = getCart().filter((c) => c.productId !== productId);
  saveCart(newCart);
};

/**
 * Sepet sayacı
 */
export const getGuestCartCount = () => {
  if (typeof window === "undefined") return 0;
  const data = localStorage.getItem("guestCart");
  if (!data) return 0;
  try {
    const items = JSON.parse(data);
    return items.length || 0;
  } catch {
    return 0;
  }
};

/**
 * Sepeti tamamen temizle
 */
export const clearGuestCart = () => {
  safeLocalStorage.remove();
};
