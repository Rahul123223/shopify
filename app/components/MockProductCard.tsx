import {Link} from 'react-router';
import type {MockProduct} from '~/lib/mock-products';

export function MockProductCard({
  product,
  index,
}: {
  product: MockProduct;
  index: number;
}) {
  return (
    <article className="mock-product-card">
      <Link
        aria-label={`View ${product.title}`}
        className="mock-product-image-link"
        prefetch="intent"
        to={`/products/${product.handle}`}
      >
        <div className={`mock-product-image image-tone-${index + 1}`}>
          <img src={product.image} alt={product.imageAlt} loading="lazy" />
          {product.badge ? (
            <span className="product-badge">{product.badge}</span>
          ) : null}
          <span className="product-quick-view" aria-hidden="true">
            View piece <span>↗</span>
          </span>
        </div>
      </Link>
      <div className="mock-product-details">
        <div>
          <p className="product-category">{product.category}</p>
          <h3>
            <Link to={`/products/${product.handle}`}>{product.title}</Link>
          </h3>
        </div>
        <p className="product-price">{product.price}</p>
      </div>
    </article>
  );
}
