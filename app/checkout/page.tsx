"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { products } from "@/lib/data";
import { ChevronLeft, Check, Package, MapPin, CreditCard } from "lucide-react";

type Step = "checkout" | "shipping" | "payment";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<Step>("checkout");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    paymentMethod: "",
  });

  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: "checkout", label: "Cart", icon: <Package className="w-4 h-4" /> },
    { key: "shipping", label: "Shipping", icon: <MapPin className="w-4 h-4" /> },
    { key: "payment", label: "Payment", icon: <CreditCard className="w-4 h-4" /> },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  // Build order items string for Web3Form
  const orderItemsString = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return "";
      return `${product.name} (Size: ${item.size}, Qty: ${item.quantity}) - $${(product.price * item.quantity).toFixed(2)}`;
    })
    .filter(Boolean)
    .join(" | ");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formDataObj = new FormData(form);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataObj,
      });

      if (response.ok) {
        setSubmitted(true);
        clearCart();
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="px-4 py-16 text-center max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Request Sealed!</h1>
          <p className="text-gray-600">
            Thank you for your order. We will process it shortly and contact you at{" "}
            <span className="font-medium">{formData.email}</span>.
          </p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="w-full bg-black text-white py-3.5 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Continue Shopping
        </button>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="px-4 py-16 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-xl font-bold mb-4">Your cart is empty</h1>
        <button
          onClick={() => router.push("/")}
          className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Back to Shop
        </button>
      </main>
    );
  }

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition bg-white";

  const canProceedToShipping = items.length > 0;
  const canProceedToPayment =
    formData.fullName &&
    formData.email &&
    formData.address &&
    formData.city &&
    formData.zip &&
    formData.country;

  return (
    <main className="px-4 py-6 max-w-lg mx-auto min-h-screen">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, index) => (
          <div key={s.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  index < currentStepIndex
                    ? "bg-green-500 text-white"
                    : index === currentStepIndex
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {index < currentStepIndex ? <Check className="w-5 h-5" /> : s.icon}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  index <= currentStepIndex ? "text-black" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 -mt-5 ${
                  index < currentStepIndex ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Back Button */}
      {step !== "checkout" && (
        <button
          onClick={() => setStep(step === "payment" ? "shipping" : "checkout")}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-black mb-4 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      )}

      {/* Step 1: Checkout / Cart Review */}
      {step === "checkout" && (
        <div>
          <h1 className="text-2xl font-bold mb-6">Your Order</h1>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="space-y-4">
              {items.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;
                return (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex items-center gap-4 bg-white rounded-lg p-3 shadow-sm"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{product.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-bold">
                      ${(product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-black text-white rounded-xl p-5 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total</span>
              <span className="text-2xl font-bold">USD ${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => setStep("shipping")}
            disabled={!canProceedToShipping}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Continue to Shipping
          </button>
        </div>
      )}

      {/* Step 2: Shipping Address */}
      {step === "shipping" && (
        <div>
          <h1 className="text-2xl font-bold mb-2">Shipping Address</h1>
          <p className="text-gray-500 text-sm mb-6">Where should we send your order?</p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Street Address *
              </label>
              <input
                type="text"
                placeholder="123 Main Street, Apt 4B"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  City *
                </label>
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  State
                </label>
                <input
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  placeholder="12345"
                  required
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  placeholder="United States"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep("payment")}
            disabled={!canProceedToPayment}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed mt-6"
          >
            Continue to Payment
          </button>
        </div>
      )}

      {/* Step 3: Payment Checkout */}
      {step === "payment" && (
        <div>
          <h1 className="text-2xl font-bold mb-2">Payment</h1>
          <p className="text-gray-500 text-sm mb-6">Choose your preferred payment method</p>

          {/* Order Summary Card */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-600">Order Total</span>
              <span className="text-lg font-bold">USD ${totalPrice.toFixed(2)}</span>
            </div>
            <div className="text-xs text-gray-500">
              Shipping to: {formData.address}, {formData.city}, {formData.zip}
            </div>
          </div>

          <form
            action="https://api.web3forms.com/submit"
            method="POST"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Web3Form Access Key */}
            <input type="hidden" name="access_key" value="f371aa3f-e817-4dec-abd0-d0b2f56b8246" />

            {/* Hidden fields for name, email, item, size, etc. */}
            <input type="hidden" name="name" value={formData.fullName} />
            <input type="hidden" name="email" value={formData.email} />
            <input type="hidden" name="phone" value={formData.phone} />
            <input type="hidden" name="address" value={formData.address} />
            <input type="hidden" name="city" value={formData.city} />
            <input type="hidden" name="state" value={formData.state} />
            <input type="hidden" name="zip" value={formData.zip} />
            <input type="hidden" name="country" value={formData.country} />
            <input type="hidden" name="item" value={orderItemsString} />
            <input type="hidden" name="total" value={`USD $${totalPrice.toFixed(2)}`} />
            <input type="hidden" name="subject" value="BTS Arirang World Tour - New Order Request" />

            {/* Payment Method Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
                Select Payment Method *
              </label>
              <div className="relative">
                <select
                  name="payment"
                  required
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition bg-white appearance-none cursor-pointer"
                >
                  <option value="">SELECT PAYMENT METHOD</option>
                  <option value="Zelle">Zelle</option>
                  <option value="Venmo">Venmo</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Cash App">Cash App</option>
                  <option value="Chime">Chime</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Selected Payment Method Info */}
            {formData.paymentMethod && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900">{formData.paymentMethod}</p>
                    <p className="text-xs text-blue-700">
                      Payment details will be sent to your email after submission
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!formData.paymentMethod || isSubmitting}
              className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                "SEAL MY REQUEST"
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              By placing this order, you agree to our terms and conditions.
            </p>
          </form>
        </div>
      )}
    </main>
  );
}
