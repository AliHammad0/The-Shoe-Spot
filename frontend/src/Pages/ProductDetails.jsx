
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiShoppingBag,
  FiTruck,
  FiRefreshCw,
  FiShield,
  FiCheck,
  FiMinus,
  FiPlus,
  FiStar,
  FiHeart,
} from "react-icons/fi";
import {
  addToCart as addCartItem,
  clearCartError,
} from "../redux/slices/cartSlice";
import { toggleWishlist } from "../redux/slices/wishlistSlice.js";
import { store } from "../redux/store.js";

const API_BASE_URL = "http://localhost:8080/api/v1";
const API_URL = `${API_BASE_URL}/products`;

const formatPrice = (price) =>
  `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;

const getColorValue = (color) => {
  const colors = {
    Black: "#000000",
    White: "#ffffff",
    Beige: "#d6c4a4",
    Green: "#47734b",
    Olive: "#777653",
    Navy: "#202b42",
    Brown: "#795548",
    Blue: "#2563eb",
    Grey: "#808080",
    Gray: "#808080",
    Red: "#dc2626",
  };

  return colors[color] || "#d1d5db";
};

const normalizeImages = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) =>
      typeof item === "string"
        ? item
        : item?.url || item?.image || ""
    )
    .filter(Boolean);
};

const normalizeProduct = (item) => {
  if (!item || typeof item !== "object") return null;

  const id = String(item._id || item.id || "");
  const rawImages = normalizeImages(item.images);

  const mainImage =
    (typeof item.image === "string" && item.image) ||
    rawImages[0] ||
    "";

  const colors = Array.isArray(item.colors)
    ? item.colors.map((color) => {
        const isString = typeof color === "string";
        const name = isString
          ? color
          : color.name || color.color || "Default";

        const variantImages = isString
          ? []
          : [
              ...normalizeImages(color.images),
              ...(typeof color.image === "string"
                ? [color.image]
                : []),
              ...(typeof color.image === "object" && color.image?.url
                ? [color.image.url]
                : []),
            ].filter(
              (image, index, array) =>
                array.indexOf(image) === index
            );

        return {
          name,
          value: isString
            ? getColorValue(name)
            : color.value || getColorValue(name),
          images: variantImages,
          image: variantImages[0] || mainImage,
        };
      })
    : [];

  const price = Number(item.price) || 0;
  const discount = Math.min(
    100,
    Math.max(0, Number(item.discount) || 0)
  );

  const oldPrice =
    Number(
      item.oldPrice ||
        item.compareAtPrice ||
        item.originalPrice
    ) ||
    (discount > 0 && discount < 100
      ? Math.round(price / (1 - discount / 100))
      : price);

  const sizes = Array.isArray(item.sizes)
    ? item.sizes
        .map((size) =>
          typeof size === "object" && size !== null
            ? Number(size.size || size.value)
            : Number(size)
        )
        .filter((size) => Number.isFinite(size) && size > 0)
    : [];

  const features = Array.isArray(item.features)
    ? item.features.map((feature) =>
        typeof feature === "string"
          ? { title: feature, description: "" }
          : {
              title:
                feature.title ||
                feature.name ||
                "Product feature",
              description: feature.description || "",
            }
      )
    : [];

  const rawStock =
    item.stock ??
    item.quantityAvailable ??
    item.quantityInStock ??
    item.countInStock ??
    item.availableStock ??
    item.quantity ??
    0;

  return {
    id,
    title: item.title || item.name || "Men's Shoes",
    category:
      typeof item.category === "string"
        ? item.category
        : item.category?.name || "Shoes",
    price,
    oldPrice,
    discount:
      oldPrice > price && oldPrice > 0
        ? Math.round(((oldPrice - price) / oldPrice) * 100)
        : discount,
    rating: Number(item.rating || item.averageRating) || 0,
    reviews:
      Number(item.reviewsCount || item.numReviews) ||
      (Array.isArray(item.reviews) ? item.reviews.length : 0),
    color: item.color || colors?.[0]?.name || "Default",
    colors,
    sizes: sizes.length ? sizes : [40, 41, 42, 43, 44, 45],
    stock: Math.max(0, Number(rawStock) || 0),
    images: rawImages.length
      ? rawImages
      : mainImage
        ? [mainImage]
        : [],
    image: mainImage,
    description:
      item.description || "Product details will be updated soon.",
    features,
    slug: item.slug || id,
    brand: item.brand || "",
    isActive: item.isActive !== false,
  };
};

const getResponseProduct = (data) => {
  if (data?.product) return data.product;
  if (data?.data?.product) return data.data.product;

  if (data?.data && !Array.isArray(data.data)) {
    return data.data;
  }

  return data;
};

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items || []);
  const reduxCartError = useSelector((state) => state.cart.error);
  const wishlistItems = useSelector(
    (state) => state.wishlist?.items || []
  );

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [cartMessage, setCartMessage] = useState("");

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadProduct = async () => {
      setLoading(true);
      setError("");

      try {
        let foundProduct = null;

        try {
          const response = await fetch(
            `${API_URL}/${encodeURIComponent(id)}`,
            { signal: controller.signal }
          );

          if (response.ok) {
            const data = await response.json();
            const candidate = normalizeProduct(
              getResponseProduct(data)
            );

            if (
              candidate &&
              (candidate.id === id || candidate.slug === id)
            ) {
              foundProduct = candidate;
            }
          }
        } catch (err) {
          if (err.name === "AbortError") throw err;
        }

        if (!foundProduct) {
          const response = await fetch(API_URL, {
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error("Products load nahi ho sake.");
          }

          const data = await response.json();

          const list = Array.isArray(data)
            ? data
            : Array.isArray(data.products)
              ? data.products
              : Array.isArray(data.data)
                ? data.data
                : [];

          const match = list.find(
            (item) =>
              String(item._id || item.id || "") === id ||
              String(item.slug || "") === id
          );

          if (match) foundProduct = normalizeProduct(match);
        }

        if (!foundProduct) {
          throw new Error("Yeh product nahi mila.");
        }

        if (!foundProduct.isActive) {
          throw new Error("Yeh product filhal available nahi hai.");
        }

        setProduct(foundProduct);

        const requestedColor = location.state?.selectedColor;

        const initialColor =
          foundProduct.colors.find(
            (color) => color.name === requestedColor
          )?.name ||
          foundProduct.colors[0]?.name ||
          foundProduct.color;

        setSelectedColor(initialColor);
        setSelectedSize(null);
        setQuantity(1);
        setActiveImage("");
        setCartMessage("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Product load nahi ho saka.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadProduct();

    return () => controller.abort();
  }, [id, location.state]);

  useEffect(() => {
    if (!product?.id) {
      setReviews([]);
      setAverageRating(0);
      setTotalReviews(0);
      return;
    }

    const controller = new AbortController();

    const loadReviews = async () => {
      setReviewsLoading(true);
      setReviewsError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/reviews/product/${encodeURIComponent(product.id)}`,
          { signal: controller.signal }
        );

        const data = await response.json();

        if (!response.ok || data?.ok === false) {
          throw new Error(
            data?.message || "Reviews load nahi ho sake."
          );
        }

        const reviewList = Array.isArray(data.reviews)
          ? data.reviews
          : Array.isArray(data.data?.reviews)
            ? data.data.reviews
            : [];

        setReviews(reviewList);

        const calculatedAverage =
          reviewList.length > 0
            ? reviewList.reduce(
                (sum, review) =>
                  sum + Number(review.rating || 0),
                0
              ) / reviewList.length
            : 0;

        setAverageRating(
          Number(data.averageRating ?? calculatedAverage) || 0
        );

        setTotalReviews(
          Number(data.totalReviews ?? reviewList.length) || 0
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          setReviews([]);
          setAverageRating(0);
          setTotalReviews(0);
          setReviewsError(
            err.message || "Reviews load nahi ho sake."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setReviewsLoading(false);
        }
      }
    };

    loadReviews();

    return () => controller.abort();
  }, [product?.id]);

  const isWishlisted = wishlistItems.some(
    (item) =>
      String(item._id || item.id || item.productId) ===
      String(product?.id)
  );

  const selectedVariant = product?.colors.find(
    (color) => color.name === selectedColor
  );

  const displayedImages = product
    ? selectedVariant?.images?.length
      ? selectedVariant.images
      : product.images.length
        ? product.images
        : product.image
          ? [product.image]
          : []
    : [];

  const displayImage = displayedImages.includes(activeImage)
    ? activeImage
    : displayedImages[0] || product?.image || "";

  useEffect(() => {
    setActiveImage("");
  }, [selectedColor]);

  const existingQuantity = cartItems
    .filter(
      (item) =>
        String(item._id || item.productId || item.id) ===
        String(product?.id)
    )
    .reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );

  const remainingStock = Math.max(
    0,
    (product?.stock || 0) - existingQuantity
  );

  const outOfStock = remainingStock <= 0;

  const selectedColorStock = selectedVariant?.stock;

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white">
        <p className="text-sm text-gray-500">Loading product...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-white px-5 text-center">
        <h1 className="text-2xl font-medium">Product unavailable</h1>
        <p className="text-sm text-gray-500">
          {error || "Product nahi mila."}
        </p>
        <Link
          to="/shop"
          className="bg-black px-6 py-3 text-sm font-semibold text-white"
        >
          Back to products
        </Link>
      </main>
    );
  }

  const installment = Math.ceil(product.price / 3);

  const handleAddToCart = () => {
    setCartMessage("");
    dispatch(clearCartError());

    if (!product.id) {
      setCartMessage("Product ID missing hai.");
      return false;
    }

    if (remainingStock <= 0) {
      setCartMessage("Yeh product filhal out of stock hai.");
      return false;
    }

    if (!selectedSize) {
      setCartMessage("Please select your shoe size first.");
      return false;
    }

    if (quantity > remainingStock) {
      setCartMessage(
        `Sirf ${remainingStock} items aur available hain.`
      );
      return false;
    }

    dispatch(
      addCartItem({
        id: product.id,
        productId: product.id,
        title: product.title,
        name: product.title,
        price: product.price,
        image: displayImage,
        size: selectedSize,
        color: selectedColor,
        quantity,
        stock: product.stock,
      })
    );

    const updatedCart = store.getState().cart;

    if (updatedCart.error) {
      setCartMessage(updatedCart.error);
      return false;
    }

    const itemExists = updatedCart.items.some(
      (item) =>
        String(item._id || item.productId || item.id) ===
        String(product.id)
    );

    if (!itemExists) {
      setCartMessage("Product cart mein add nahi hua.");
      return false;
    }

    setCartMessage("Product added to your bag.");
    return true;
  };

  const buyNow = () => {
    if (handleAddToCart()) navigate("/checkout");
  };

  const visibleCartMessage = reduxCartError || cartMessage;

  return (
    <main
      className="min-h-screen bg-white text-[#191919]"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-10">
        <nav className="mb-7 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-black">
            Men
          </Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-black">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <section className="min-w-0">
            <div className="relative overflow-hidden bg-[#f5f3ef]">
              {displayImage ? (
                <img
                  key={displayImage}
                  src={displayImage}
                  alt={`${product.title} ${selectedColor}`}
                  className="aspect-[4/4.2] w-full object-contain mix-blend-multiply"
                />
              ) : (
                <div className="flex aspect-[4/4.2] items-center justify-center text-sm text-gray-400">
                  No image available for this colour
                </div>
              )}

              {product.discount > 0 && (
                <span className="absolute left-4 top-4 bg-white px-3 py-2 text-[10px] font-semibold tracking-[0.15em]">
                  SAVE {product.discount}%
                </span>
              )}

              {outOfStock && (
                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      toggleWishlist({
                        ...product,
                        image: displayImage,
                        selectedColor,
                      })
                    )
                  }
                  aria-label={
                    isWishlisted
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  aria-pressed={isWishlisted}
                  className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white transition hover:bg-black hover:text-white ${
                    isWishlisted ? "text-red-600" : ""
                  }`}
                >
                  <FiHeart
                    className={isWishlisted ? "fill-current" : ""}
                    size={18}
                  />
                </button>
              )}
            </div>

            {displayedImages.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {displayedImages.map((image, index) => (
                  <button
                    key={`${selectedColor}-${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(image)}
                    aria-label={`View ${selectedColor} image ${index + 1}`}
                    className={`overflow-hidden border ${
                      displayImage === image
                        ? "border-black"
                        : "border-transparent"
                    } bg-[#f5f3ef]`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${selectedColor} view ${index + 1}`}
                      className="aspect-square w-full object-contain mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-7 hidden border-t border-gray-200 pt-6 lg:block">
              <h2 className="text-sm font-semibold tracking-wide">
                PRODUCT INFORMATION
              </h2>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                {product.description}
              </p>
            </div>
          </section>

          <section className="min-w-0 lg:pt-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8c7650]">
              Men · {product.category}
            </p>

            <h1 className="mt-3 text-2xl font-medium leading-snug sm:text-3xl">
              {product.title}
            </h1>

            {product.brand && (
              <p className="mt-2 text-sm text-gray-500">
                {product.brand}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <div className="flex gap-1 text-[#b69a68]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <FiStar
                    key={index}
                    size={14}
                    className={
                      index < Math.round(averageRating)
                        ? "fill-current"
                        : ""
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-semibold">
                {averageRating.toFixed(1)}
              </span>
              <a
                href="#reviews"
                className="text-sm text-gray-500 underline underline-offset-4"
              >
                {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-semibold">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice > product.price && (
                <>
                  <span className="text-base text-gray-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                  <span className="bg-[#f1ede5] px-2 py-1 text-xs font-semibold text-[#806b48]">
                    Save {product.discount}%
                  </span>
                </>
              )}
            </div>

            <div className="mt-5 border-y border-gray-200 py-4">
              <p className="text-sm text-gray-600">
                Pay in 3 installments of{" "}
                <span className="font-semibold text-black">
                  {formatPrice(installment)}
                </span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Availability depends on your payment provider.
              </p>
            </div>

            {product.colors.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold">
                  Colour{" "}
                  <span className="font-normal">
                    — {selectedColor.toUpperCase()}
                  </span>
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color.name);
                        setActiveImage("");
                        setCartMessage("");
                        dispatch(clearCartError());
                      }}
                      aria-label={`Select ${color.name}`}
                      aria-pressed={selectedColor === color.name}
                      title={color.name}
                      className={`h-11 w-11 rounded-full border p-1 ${
                        selectedColor === color.name
                          ? "border-black"
                          : "border-gray-200"
                      }`}
                    >
                      <span
                        className="block h-full w-full rounded-full border border-black/10"
                        style={{ backgroundColor: color.value }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-7">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">
                  Select size <span className="font-normal">(EU)</span>
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab((tab) => (tab === "size" ? "" : "size"))
                  }
                  className="text-xs underline underline-offset-4"
                >
                  Size guide
                </button>
              </div>

              <div className="mt-3 grid grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setSelectedSize(size);
                      setCartMessage("");
                      dispatch(clearCartError());
                    }}
                    className={`flex h-12 items-center justify-center border text-sm transition ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {activeTab === "size" && (
                <div className="mt-4 bg-[#f7f5f1] p-4 text-sm">
                  <p className="font-semibold">Size guide</p>
                  <p className="mt-2 leading-6 text-gray-600">
                    Select your usual EU shoe size. If you are between sizes,
                    check the product measurements before ordering.
                  </p>
                </div>
              )}

              <p className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <FiCheck size={15} className="text-green-700" />
                {outOfStock
                  ? "Yeh product out of stock hai."
                  : `${remainingStock} items available`}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex h-11 items-center border border-gray-300">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) => Math.max(1, value - 1))
                  }
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="flex h-full w-10 items-center justify-center disabled:opacity-40"
                >
                  <FiMinus size={14} />
                </button>
                <span className="w-8 text-center text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) =>
                      Math.min(remainingStock, value + 1)
                    )
                  }
                  disabled={quantity >= remainingStock || outOfStock}
                  aria-label="Increase quantity"
                  className="flex h-full w-10 items-center justify-center disabled:opacity-40"
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>

            {visibleCartMessage && (
              <p
                role="status"
                className={`mt-4 p-3 text-sm ${
                  visibleCartMessage.toLowerCase().includes("added")
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {visibleCartMessage}
              </p>
            )}

            {/* Out of stock: Wishlist option */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {outOfStock ? (
                <>
                  <button
                    type="button"
                    disabled
                    className="flex min-h-12 cursor-not-allowed items-center justify-center gap-3 bg-gray-400 px-5 py-3 text-sm font-semibold text-white"
                  >
                    <FiShoppingBag size={17} />
                    Out of stock
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      dispatch(
                        toggleWishlist({
                          ...product,
                          image: displayImage,
                          selectedColor,
                        })
                      )
                    }
                    className={`flex min-h-12 items-center justify-center gap-3 border px-5 py-3 text-sm font-semibold transition ${
                      isWishlisted
                        ? "border-red-600 bg-red-50 text-red-600"
                        : "border-black text-black hover:bg-[#f5f3ef]"
                    }`}
                  >
                    <FiHeart
                      size={17}
                      className={isWishlisted ? "fill-current" : ""}
                    />
                    {isWishlisted
                      ? "Remove from wishlist"
                      : "Add to wishlist"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex min-h-12 items-center justify-center gap-3 bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#333]"
                  >
                    <FiShoppingBag size={17} />
                    Add to bag
                  </button>

                  <button
                    type="button"
                    onClick={buyNow}
                    className="min-h-12 border border-black px-5 py-3 text-sm font-semibold transition hover:bg-[#f5f3ef]"
                  >
                    Buy now
                  </button>
                </>
              )}
            </div>

            <p className="mt-3 text-center text-xs text-gray-500">
              Secure checkout · Cash on Delivery available
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3 border-y border-gray-200 py-5">
              <div className="flex flex-col items-center text-center">
                <FiTruck size={21} />
                <p className="mt-3 text-xs font-semibold">Fast delivery</p>
                <p className="mt-1 text-[11px] leading-5 text-gray-500">
                  2–5 working days
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <FiRefreshCw size={21} />
                <p className="mt-3 text-xs font-semibold">Easy exchange</p>
                <p className="mt-1 text-[11px] leading-5 text-gray-500">
                  Subject to policy
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <FiShield size={21} />
                <p className="mt-3 text-xs font-semibold">Secure payment</p>
                <p className="mt-1 text-[11px] leading-5 text-gray-500">
                  COD available
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() =>
                  setActiveTab((tab) =>
                    tab === "overview" ? "" : "overview"
                  )
                }
                className="flex w-full items-center justify-between border-b border-gray-200 py-5 text-left"
              >
                <span className="text-sm font-semibold">Overview</span>
                <span className="text-xl font-light">
                  {activeTab === "overview" ? "−" : "+"}
                </span>
              </button>

              {activeTab === "overview" && (
                <div className="border-b border-gray-200 py-5">
                  <h2 className="text-base font-semibold">
                    {product.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {product.description}
                  </p>

                  {product.features.length > 0 && (
                    <>
                      <h3 className="mt-5 text-sm font-semibold">
                        Key features
                      </h3>
                      <ul className="mt-3 space-y-3">
                        {product.features.map((feature, index) => (
                          <li key={`${feature.title}-${index}`}>
                            <p className="text-sm font-medium">
                              {feature.title}
                            </p>
                            {feature.description && (
                              <p className="mt-1 text-sm leading-6 text-gray-500">
                                {feature.description}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  setActiveTab((tab) =>
                    tab === "materials" ? "" : "materials"
                  )
                }
                className="flex w-full items-center justify-between border-b border-gray-200 py-5 text-left"
              >
                <span className="text-sm font-semibold">Materials & care</span>
                <span className="text-xl font-light">
                  {activeTab === "materials" ? "−" : "+"}
                </span>
              </button>

              {activeTab === "materials" && (
                <div className="border-b border-gray-200 py-5 text-sm leading-7 text-gray-600">
                  {product.description}
                  <p className="mt-2">
                    Clean gently with a soft cloth and allow shoes to air dry.
                    Check the product label for exact material details.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  setActiveTab((tab) =>
                    tab === "delivery" ? "" : "delivery"
                  )
                }
                className="flex w-full items-center justify-between border-b border-gray-200 py-5 text-left"
              >
                <span className="text-sm font-semibold">Delivery & returns</span>
                <span className="text-xl font-light">
                  {activeTab === "delivery" ? "−" : "+"}
                </span>
              </button>

              {activeTab === "delivery" && (
                <div className="border-b border-gray-200 py-5 text-sm leading-7 text-gray-600">
                  <p>
                    Estimated delivery is 2–5 working days across Pakistan.
                    Delivery times can vary by location.
                  </p>
                  <p className="mt-2">
                    Cash on Delivery is subject to service availability.
                    Exchanges are subject to your store policy.
                  </p>
                </div>
              )}
            </div>

            <div id="reviews" className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-medium">Customer reviews</h2>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-3xl font-semibold">
                  {averageRating.toFixed(1)}
                </span>

                <div>
                  <div className="flex gap-1 text-[#b69a68]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FiStar
                        key={index}
                        size={15}
                        className={
                          index < Math.round(averageRating)
                            ? "fill-current"
                            : ""
                        }
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Based on {totalReviews}{" "}
                    {totalReviews === 1 ? "review" : "reviews"}
                  </p>
                </div>
              </div>

              {reviewsLoading ? (
                <p className="mt-6 text-sm text-gray-500">
                  Loading customer reviews...
                </p>
              ) : reviewsError ? (
                <p role="status" className="mt-6 text-sm text-red-600">
                  {reviewsError}
                </p>
              ) : reviews.length === 0 ? (
                <div className="mt-6 border-t border-gray-200 py-6">
                  <p className="text-sm font-medium">No reviews yet</p>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Is product ka review abhi available nahi hai. Delivered
                    order ke customers apna review submit kar sakte hain.
                  </p>
                </div>
              ) : (
                <div className="mt-6 divide-y divide-gray-200 border-t border-gray-200">
                  {reviews.map((review, index) => {
                    const reviewId =
                      review._id || `${review.createdAt}-${index}`;

                    return (
                      <article key={reviewId} className="py-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-sm font-semibold">
                            {review.customerName || "Verified customer"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {review.createdAt &&
                              new Date(review.createdAt).toLocaleDateString(
                                "en-PK",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                          </p>
                        </div>

                        <div
                          className="mt-2 flex gap-1 text-[#b69a68]"
                          aria-label={`${Number(review.rating) || 0} out of 5 stars`}
                        >
                          {Array.from({ length: 5 }).map((_, starIndex) => (
                            <FiStar
                              key={starIndex}
                              size={14}
                              className={
                                starIndex < Number(review.rating || 0)
                                  ? "fill-current"
                                  : ""
                              }
                            />
                          ))}
                        </div>

                        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                          {review.comment}
                        </p>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
