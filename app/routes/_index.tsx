import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {MockProductCard} from '~/components/MockProductCard';
import {mockProducts} from '~/lib/mock-products';

export const meta: Route.MetaFunction = () => [
  {title: 'Serein Studio | Thoughtful things for everyday'},
  {
    name: 'description',
    content: 'Thoughtful objects for slower mornings and softer evenings.',
  },
];

/**
 * This route loader runs on the server. Stage 2 returns local demo data here;
 * the next data stages will replace it with Shopify Storefront API queries.
 */
export async function loader() {
  return {products: mockProducts};
}

export default function Homepage() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="store-home">
      <section className="store-hero" aria-labelledby="hero-title">
        <div className="store-hero-copy">
          <p className="eyebrow">A little more considered</p>
          <h1 id="hero-title">Make room for the everyday.</h1>
          <p className="store-hero-description">
            Useful objects, honest materials, and small details that make home
            feel more like yours.
          </p>
          <Link className="button button-light" to="#featured-products">
            Explore the collection <span aria-hidden="true">↗</span>
          </Link>
          <p className="demo-label">Demo storefront · sample products</p>
        </div>
        <div className="store-hero-image" role="img" aria-label="A calm, sunlit living room with natural materials" />
        <div className="hero-image-caption">
          <span>Objects for a softer landing</span>
          <span>01 / 04</span>
        </div>
      </section>

      <section className="store-promises" aria-label="Our approach">
        <p>Made to be lived with</p>
        <p>Thoughtful by design</p>
        <p>Simple, honest materials</p>
      </section>

      <section
        className="featured-products"
        id="featured-products"
        aria-labelledby="featured-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">The considered edit</p>
            <h2 id="featured-title">Everyday, elevated.</h2>
          </div>
          <Link className="text-link" to="/collections">
            Browse all <span aria-hidden="true">→</span>
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="mock-product-grid">
            {products.map((product, index) => (
              <MockProductCard key={product.handle} product={product} index={index} />
            ))}
          </div>
        ) : (
          <p className="catalog-empty">New pieces are on their way.</p>
        )}
      </section>

      <section className="store-note" aria-labelledby="store-note-title">
        <p className="eyebrow">Serein Studio</p>
        <h2 id="store-note-title">A slower kind of everyday.</h2>
        <p>
          We believe the things we keep close should feel good to use, and good
          to keep. Start with one piece you love.
        </p>
        <Link className="text-link" to="#featured-products">
          Find your favorite <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  );
}
