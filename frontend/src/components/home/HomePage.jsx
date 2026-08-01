import { NavLink } from "react-router-dom";

export default function HomePage() {

  const products = [
    {
      id: 1,
      title: "Wedding Dress",
      type: "Rent",
      price: "₹1500/day",
      image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=600"
    },
    {
      id: 2,
      title: "DSLR Camera",
      type: "Rent",
      price: "₹500/day",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600"
    },
    {
      id: 3,
      title: "iPhone 15",
      type: "Buy",
      price: "₹55,000",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"
    },
    {
      id: 4,
      title: "Gaming Console",
      type: "Rent",
      price: "₹800/day",
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600"
    }
  ];

  return (
    <>
      {/* Navbar */}

      <nav className="navbar navbar-expand-lg bg-white shadow-sm">
        <div className="container">

          <span className="navbar-brand fw-bold fs-3">
            TradeNest
          </span>

          <div className="ms-auto">

            <NavLink
              to="/login"
              className="btn btn-outline-primary me-2"
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className="btn btn-primary"
            >
              Register
            </NavLink>

          </div>
        </div>
      </nav>

      {/* Hero */}

      <section className="bg-primary text-white py-5">
        <div className="container text-center">

          <h1 className="display-4 fw-bold">
            Buy • Sell • Rent
          </h1>

          <p className="lead">
            One platform for all your assets
          </p>

        </div>
      </section>

      {/* Categories */}

      <div className="container mt-5">

        <h2 className="mb-4">
          Browse Categories
        </h2>

        <div className="row text-center">

          <div className="col-md-3 mb-3">
            <div className="card p-3">
              Electronics
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card p-3">
              Furniture
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card p-3">
              Vehicles
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card p-3">
              Wedding Items
            </div>
          </div>

        </div>

      </div>

      {/* Products */}

      <div className="container my-5">

        <h2 className="mb-4">
          Fresh Recommendations
        </h2>

        <div className="row">

          {
            products.map(product => (

              <div
                key={product.id}
                className="col-md-3 mb-4"
              >
                <div className="card h-100 shadow-sm">

                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.title}
                    style={{
                      height: "220px",
                      objectFit: "cover"
                    }}
                  />

                  <div className="card-body">

                    <span className="badge bg-success">
                      {product.type}
                    </span>

                    <h5 className="mt-2">
                      {product.title}
                    </h5>

                    <h6>
                      {product.price}
                    </h6>

                  </div>

                </div>
              </div>

            ))
          }

        </div>

      </div>

    </>
  );
}