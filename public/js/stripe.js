/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";
const stripe = Stripe(
  "pk_test_51MUpgJL0UTQ2FKXOJlIyHdHxR13meI8KELlQum7T0hhQ8pvs6DzmtLI4nDA7bQjazvwO4F5Mj1vu6LpSiTePfEVZ0059u6xqjW"
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
     console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert("error", err);
  }
};
