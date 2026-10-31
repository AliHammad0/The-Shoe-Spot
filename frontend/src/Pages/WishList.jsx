
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import {
  removeFromWishlist,
  clearWishlist,
} from "../redux/slices/wishlistSlice.js";

const formatPrice = (price) =>
  `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;

export default function WishList() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.wishlist?.items || []);

  const getProductId = (product) => product._id || product.id;

  const getProductImage = (product) => {
    if (typeof product.image === "string" && product.image) {
      return product.image;
    }

    if (typeof product.image === "object" && product.image?.url) {
      return product.image.url;
    }

    if (Array.isArray(product.images) && product.images.length > 0) {
      const image = product.images[0];

      return typeof image === "string" ? image : image?.url || "";
    }

    return "";
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-12 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3">
            <FiHeart size={25} className="text-[#6f5c3d]" />

            <h1 className="text-3xl font-semibold tracking-tight text-[#191919] sm:text-4xl">
              My Wishlist
            </h1>
          </div>

          <p className="mt-3 text-sm text-gray-500">
            Your favourite shoes, all in one place.
          </p>

          {items.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              {items.length} {items.length === 1 ? "product" : "products"} saved
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center px-4 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white">
              <FiHeart size={34} className="text-[#b69a68]" />
            </div>

            <h2 className="text-xl font-semibold text-[#191919]">
              Your wishlist is empty
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
              You haven't saved any shoes yet. Explore our collection and save
              the styles you love.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 bg-[#191919] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#6f5c3d]"
            >
              <FiShoppingBag size={17} />
              Explore Shoes
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-end">
              <button
                type="button"
                onClick={() => dispatch(clearWishlist())}
                className="text-sm font-medium text-gray-500 underline underline-offset-4 transition hover:text-red-600"
              >
                Clear Wishlist
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((product) => {
                const productId = getProductId(product);
                const image = getProductImage(product);
                const productPath = `/product/${encodeURIComponent(
                  product.slug || productId
                )}`;

                return (
                  <article
                    key={productId}
                    className="group overflow-hidden border border-gray-100 bg-white"
                  >
                    <div className="relative overflow-hidden bg-[#f3f1ec]">
                      <Link
                        to={productPath}
                        className="block aspect-[4/4.3] overflow-hidden"
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={product.title || product.name || "Shoe"}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-gray-400">
                            No image available
                          </div>
                        )}
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          dispatch(removeFromWishlist(productId))
                        }
                        aria-label={`Remove ${product.title || product.name || "product"} from wishlist`}
                        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600 shadow-sm transition hover:bg-red-600 hover:text-white"
                      >
                        <FiTrash2 size={17} />
                      </button>
                    </div>

                    <div className="p-4">
                      <Link to={productPath}>
                        <h2 className="line-clamp-2 min-h-12 text-base font-medium text-[#191919] transition hover:text-[#6f5c3d]">
                          {product.title || product.name || "Untitled Product"}
                        </h2>
                      </Link>

                      <p className="mt-2 text-base font-semibold text-[#191919]">
                        {formatPrice(product.price)}
                      </p>

                      <Link
                        to={productPath}
                        className="mt-5 flex w-full items-center justify-center gap-2 border border-[#191919] px-4 py-3 text-sm font-medium text-[#191919] transition hover:bg-[#191919] hover:text-white"
                      >
                        <FiShoppingBag size={16} />
                        View Product
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
