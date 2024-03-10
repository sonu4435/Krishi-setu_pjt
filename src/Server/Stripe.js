import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51OsGNZSAeIBWMEZYOyhZMJe7cKm1E7Qcni8hqPQscNTCHTJ7LaX7qqJ4ombWA38pf30vfOKAjZ8psjN0lTnr4yYU00fqaDgAEB"
);

export default function App() {
  const options = {
    // passing the client secret obtained from the server
    clientSecret: import.meta.env.VITE_STRIPE_SECRET_KEY,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
}
