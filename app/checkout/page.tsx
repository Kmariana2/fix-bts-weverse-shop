"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { products } from "@/lib/data";
import {
  ChevronLeft,
  Check,
  Package,
  MapPin,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Smartphone,
} from "lucide-react";

type Step = "checkout" | "shipping" | "payment";
type PaymentTab = "card" | "digital";

// ── Card-type detection ──────────────────────────────────────────────────────
function detectCardType(num: string): "visa" | "mastercard" | "amex" | "discover" | null {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^6(?:011|5)/.test(n)) return "discover";
  return null;
}

// ── Card number formatter ────────────────────────────────────────────────────
function formatCardNumber(value: string, isAmex: boolean): string {
  const digits = value.replace(/\D/g, "");
  if (isAmex) {
    // 4-6-5 format
    return digits
      .slice(0, 15)
      .replace(/(\d{4})(\d{0,6})(\d{0,5})/, (_, a, b, c) =>
        [a, b, c].filter(Boolean).join(" ")
      );
  }
  // 4-4-4-4 format
  return digits
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

// ── Expiry formatter ─────────────────────────────────────────────────────────
function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

// ── Card brand SVG logos ─────────────────────────────────────────────────────
function CardLogo({ type }: { type: "visa" | "mastercard" | "amex" | "discover" | null }) {
  if (!type) return null;
  const logos: Record<string, JSX.Element> = {
    visa: (
      <svg viewBox="0 0 48 16" className="h-5 w-auto" aria-label="Visa">
        <text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#1A1F71">VISA</text>
      </svg>
    ),
    mastercard: (
      <svg viewBox="0 0 38 24" className="h-5 w-auto" aria-label="Mastercard">
        <circle cx="14" cy="12" r="10" fill="#EB001B" />
        <circle cx="24" cy="12" r="10" fill="#F79E1B" />
        <path d="M19 5.3a10 10 0 0 1 0 13.4A10 10 0 0 1 19 5.3z" fill="#FF5F00" />
      </svg>
    ),
    amex: (
      <svg viewBox="0 0 48 16" className="h-5 w-auto" aria-label="Amex">
        <text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="#2E77BC">AMEX</text>
      </svg>
    ),
    discover: (
      <svg viewBox="0 0 60 16" className="h-5 w-auto" aria-label="Discover">
        <text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="10" fill="#F76F20">DISCOVER</text>
      </svg>
    ),
  };
  return logos[type] ?? null;
}

// ── Digital payment method config ────────────────────────────────────────────
const DIGITAL_METHODS = [
  { id: "Zelle",    label: "Zelle",    color: "#6D1ED4", bg: "#F3EEFF" },
  { id: "Venmo",    label: "Venmo",    color: "#008CFF", bg: "#EBF5FF" },
  { id: "PayPal",   label: "PayPal",   color: "#003087", bg: "#EEF4FF" },
  { id: "Cash App", label: "Cash App", color: "#00D64F", bg: "#E8FFF2" },
  { id: "Chime",    label: "Chime",    color: "#1EC677", bg: "#E8FFF4" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();

  // ── Step state ──────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("checkout");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);

  // ── Shipping form ───────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  // ── Payment state ───────────────────────────────────────────────────────────
  const [paymentTab, setPaymentTab] = useState<PaymentTab>("card");
  const [digitalMethod, setDigitalMethod] = useState("");
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [showCvv, setShowCvv] = useState(false);
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  // ── Derived ─────────────────────────────────────────────────────────────────
  const cardType = detectCardType(cardData.number);
  const isAmex = cardType === "amex";
  const shipping = totalPrice >= 100 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  const orderItemsString = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return "";
      return `${product.name} (Size: ${item.size}, Qty: ${item.quantity}) - $${(product.price * item.quantity).toFixed(2)}`;
    })
    .filter(Boolean)
    .join(" | ");

  // ── Validation ──────────────────────────────────────────────────────────────
  const canProceedToShipping = items.length > 0;
  const canProceedToPayment =
    formData.fullName && formData.email && formData.address &&
    formData.city && formData.zip && formData.country;

  const validateCard = useCallback(() => {
    const errs: Record<string, string> = {};
    const digits = cardData.number.replace(/\s/g, "");
    if (digits.length < (isAmex ? 15 : 16)) errs.number = "Enter a valid card number";
    if (!cardData.name.trim()) errs.name = "Cardholder name is required";
    const [mm, yy] = cardData.expiry.split("/");
    const now = new Date();
    const expMonth = parseInt(mm, 10);
    const expYear = parseInt("20" + yy, 10);
    if (!mm || !yy || expMonth < 1 || expMonth > 12 ||
        expYear < now.getFullYear() ||
        (expYear === now.getFullYear() && expMonth < now.getMonth() + 1)) {
      errs.expiry = "Enter a valid expiry date";
    }
    const cvvLen = isAmex ? 4 : 3;
    if (cardData.cvv.length < cvvLen) errs.cvv = `CVV must be ${cvvLen} digits`;
    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  }, [cardData, isAmex]);

  const canSubmitCard = paymentTab === "card" &&
    cardData.number.replace(/\s/g, "").length >= (isAmex ? 15 : 16) &&
    cardData.name.trim() &&
    cardData.expiry.length === 5 &&
    cardData.cvv.length >= 3;

  const canSubmitDigital = paymentTab === "digital" && !!digitalMethod;

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (paymentTab === "card" && !validateCard()) return;
    setIsSubmitting(true);

    const paymentInfo =
      paymentTab === "card"
        ? `Card ending in ${cardData.number.replace(/\s/g, "").slice(-4)} (${cardType ?? "card"})`
        : digitalMethod;

    const body = new FormData();
    body.append("access_key", "f371aa3f-e817-4dec-abd0-d0b2f56b8246");
    body.append("subject", "BTS Arirang World Tour - New Order Request");
    body.append("name", formData.fullName);
    body.append("email", formData.email);
    body.append("phone", formData.phone);
    body.append("address", `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}, ${formData.country}`);
    body.append("item", orderItemsString);
    body.append("subtotal", `USD $${totalPrice.toFixed(2)}`);
    body.append("shipping", shipping === 0 ? "FREE" : `USD $${shipping.toFixed(2)}`);
    body.append("tax", `USD $${tax.toFixed(2)}`);
    body.append("total", `USD $${grandTotal.toFixed(2)}`);
    body.append("payment", paymentInfo);

    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body });
      if (res.ok) {
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

  // ── Shared styles ───────────────────────────────────────────────────────────
  const inputClass =
    "w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition bg-white placeholder:text-gray-400";
  const errorInputClass =
    "w-full border border-red-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition bg-white placeholder:text-gray-400";

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <main className="px-4 py-16 text-center max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Order Placed! 💜</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Thank you for your order. A confirmation will be sent to{" "}
            <span className="font-semibold text-black">{formData.email}</span>. We will
            process your order and ship within 3–5 business days.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shipping</span>
            <span className="font-medium text-green-600">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tax (8%)</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-bold text-base">
            <span>Total Charged</span>
            <span>USD ${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={() => router.push("/")}
          className="w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition"
        >
          Continue Shopping
        </button>
      </main>
    );
  }

  // ── Empty cart ──────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <main className="px-4 py-16 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-xl font-bold mb-4">Your cart is empty</h1>
        <button
          onClick={() => router.push("/")}
          className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
        >
          Back to Shop
        </button>
      </main>
    );
  }

  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: "checkout", label: "Cart",     icon: <Package className="w-4 h-4" /> },
    { key: "shipping", label: "Shipping", icon: <MapPin className="w-4 h-4" /> },
    { key: "payment",  label: "Payment",  icon: <CreditCard className="w-4 h-4" /> },
  ];
  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <main className="px-4 py-6 max-w-lg mx-auto min-h-screen pb-16">
      {/* ── Step Indicator ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, index) => (
          <div key={s.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  index < currentStepIndex
                    ? "bg-green-500 text-white"
                    : index === currentStepIndex
                    ? "bg-black text-white shadow-lg"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index < currentStepIndex ? <Check className="w-5 h-5" /> : s.icon}
              </div>
              <span className={`text-xs mt-2 font-medium ${index <= currentStepIndex ? "text-black" : "text-gray-400"}`}>
                {s.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-2 -mt-5 transition-all ${index < currentStepIndex ? "bg-green-500" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Back Button */}
      {step !== "checkout" && (
        <button
          onClick={() => setStep(step === "payment" ? "shipping" : "checkout")}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-black mb-5 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 1 — CART REVIEW
         ══════════════════════════════════════════════════════════════════════ */}
      {step === "checkout" && (
        <div>
          <h1 className="text-2xl font-bold mb-6">Your Order</h1>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-3">
            {items.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              if (!product) return null;
              return (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex items-center gap-4 bg-white rounded-xl p-3 shadow-sm"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-contain rounded-lg flex-shrink-0 bg-gray-50"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold line-clamp-2 leading-snug">{product.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {item.size} &nbsp;·&nbsp; Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-bold flex-shrink-0">
                    ${(product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Price breakdown */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax (est. 8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-base">
              <span>Total</span>
              <span>USD ${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {shipping === 0 && (
            <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>Your order qualifies for <strong>free shipping</strong>!</span>
            </div>
          )}

          <button
            onClick={() => setStep("shipping")}
            disabled={!canProceedToShipping}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Continue to Shipping
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 2 — SHIPPING ADDRESS
         ══════════════════════════════════════════════════════════════════════ */}
      {step === "shipping" && (
        <div>
          <h1 className="text-2xl font-bold mb-1">Shipping Address</h1>
          <p className="text-gray-500 text-sm mb-6">Where should we send your order?</p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Full Name *</label>
              <input type="text" placeholder="Enter your full name" required value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Email Address *</label>
              <input type="email" placeholder="your@email.com" required value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Phone Number</label>
              <input type="tel" placeholder="+1 (555) 000-0000" value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Street Address *</label>
              <input type="text" placeholder="123 Main Street, Apt 4B" required value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">City *</label>
                <input type="text" placeholder="City" required value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">State</label>
                <input type="text" placeholder="State" value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">ZIP Code *</label>
                <input type="text" placeholder="12345" required value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Country *</label>
                <input type="text" placeholder="United States" required value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })} className={inputClass} />
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

      {/* ══════════════════════════════════════════════════════════════════════
          STEP 3 — PAYMENT
         ══════════════════════════════════════════════════════════════════════ */}
      {step === "payment" && (
        <div>
          <h1 className="text-2xl font-bold mb-1">Payment</h1>
          <p className="text-gray-500 text-sm mb-6">Complete your purchase securely</p>

          {/* ── Collapsible Order Summary ──────────────────────────────────── */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl mb-6 overflow-hidden">
            <button
              onClick={() => setOrderSummaryOpen((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold hover:bg-gray-100 transition"
            >
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-500" />
                Order Summary
                <span className="text-gray-400 font-normal">({items.length} item{items.length !== 1 ? "s" : ""})</span>
              </span>
              <div className="flex items-center gap-3">
                <span className="font-bold text-base">USD ${grandTotal.toFixed(2)}</span>
                {orderSummaryOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
              </div>
            </button>

            {orderSummaryOpen && (
              <div className="border-t border-gray-200 px-5 py-4 space-y-4">
                {/* Item list */}
                <div className="space-y-3">
                  {items.map((item) => {
                    const product = products.find((p) => p.id === item.productId);
                    if (!product) return null;
                    return (
                      <div key={`${item.productId}-${item.size}`} className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <img src={product.image} alt={product.name}
                            className="w-12 h-12 object-contain rounded-lg bg-white border border-gray-100" />
                          <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-500">Size: {item.size}</p>
                        </div>
                        <span className="text-xs font-bold">${(product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Price breakdown */}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Subtotal</span><span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm border-t pt-2">
                    <span>Total</span><span>USD ${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Shipping to */}
                <div className="flex items-start gap-2 bg-white border border-gray-100 rounded-xl p-3">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-600">
                    <p className="font-semibold text-gray-800">{formData.fullName}</p>
                    <p>{formData.address}</p>
                    <p>{formData.city}{formData.state ? `, ${formData.state}` : ""} {formData.zip}</p>
                    <p>{formData.country}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Payment Method Tabs ────────────────────────────────────────── */}
          <div className="flex rounded-xl border border-gray-200 overflow-hidden mb-6">
            <button
              onClick={() => setPaymentTab("card")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition ${
                paymentTab === "card" ? "bg-black text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Credit / Debit Card
            </button>
            <button
              onClick={() => setPaymentTab("digital")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition border-l border-gray-200 ${
                paymentTab === "digital" ? "bg-black text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Digital Wallet
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Hidden fields */}
            <input type="hidden" name="access_key" value="f371aa3f-e817-4dec-abd0-d0b2f56b8246" />
            <input type="hidden" name="subject" value="BTS Arirang World Tour - New Order Request" />
            <input type="hidden" name="name" value={formData.fullName} />
            <input type="hidden" name="email" value={formData.email} />
            <input type="hidden" name="phone" value={formData.phone} />
            <input type="hidden" name="address" value={`${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}, ${formData.country}`} />
            <input type="hidden" name="item" value={orderItemsString} />
            <input type="hidden" name="subtotal" value={`USD $${totalPrice.toFixed(2)}`} />
            <input type="hidden" name="shipping" value={shipping === 0 ? "FREE" : `USD $${shipping.toFixed(2)}`} />
            <input type="hidden" name="tax" value={`USD $${tax.toFixed(2)}`} />
            <input type="hidden" name="total" value={`USD $${grandTotal.toFixed(2)}`} />
            <input type="hidden" name="payment"
              value={
                paymentTab === "card" && cardData.number
                  ? `Card ending ${cardData.number.replace(/\s/g, "").slice(-4)} (${cardType ?? "card"})`
                  : digitalMethod
              }
            />

            {/* ── CARD PAYMENT FORM ────────────────────────────────────────── */}
            {paymentTab === "card" && (
              <div className="space-y-4">
                {/* Card Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    Card Number *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0000 0000 0000 0000"
                      value={cardData.number}
                      onChange={(e) =>
                        setCardData({
                          ...cardData,
                          number: formatCardNumber(e.target.value, isAmex),
                        })
                      }
                      className={`${cardErrors.number ? errorInputClass : inputClass} pr-16`}
                      maxLength={isAmex ? 17 : 19}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {cardType ? (
                        <CardLogo type={cardType} />
                      ) : (
                        <div className="flex gap-1 opacity-30">
                          <svg viewBox="0 0 48 16" className="h-4 w-auto"><text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#1A1F71">VISA</text></svg>
                          <svg viewBox="0 0 38 24" className="h-4 w-auto"><circle cx="14" cy="12" r="10" fill="#EB001B" /><circle cx="24" cy="12" r="10" fill="#F79E1B" /></svg>
                        </div>
                      )}
                    </div>
                  </div>
                  {cardErrors.number && <p className="text-xs text-red-500 mt-1">{cardErrors.number}</p>}
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Name as it appears on card"
                    value={cardData.name}
                    onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                    className={cardErrors.name ? errorInputClass : inputClass}
                  />
                  {cardErrors.name && <p className="text-xs text-red-500 mt-1">{cardErrors.name}</p>}
                </div>

                {/* Expiry + CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/YY"
                      value={cardData.expiry}
                      onChange={(e) =>
                        setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })
                      }
                      className={cardErrors.expiry ? errorInputClass : inputClass}
                      maxLength={5}
                    />
                    {cardErrors.expiry && <p className="text-xs text-red-500 mt-1">{cardErrors.expiry}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                      CVV *
                    </label>
                    <div className="relative">
                      <input
                        type={showCvv ? "text" : "password"}
                        inputMode="numeric"
                        placeholder={isAmex ? "4 digits" : "3 digits"}
                        value={cardData.cvv}
                        onChange={(e) =>
                          setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, "").slice(0, isAmex ? 4 : 3) })
                        }
                        className={`${cardErrors.cvv ? errorInputClass : inputClass} pr-10`}
                        maxLength={isAmex ? 4 : 3}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCvv((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                        aria-label={showCvv ? "Hide CVV" : "Show CVV"}
                      >
                        {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {cardErrors.cvv && <p className="text-xs text-red-500 mt-1">{cardErrors.cvv}</p>}
                  </div>
                </div>

                {/* Billing same as shipping note */}
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl px-4 py-3">
                  <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  Billing address same as shipping address
                </div>
              </div>
            )}

            {/* ── DIGITAL WALLET FORM ──────────────────────────────────────── */}
            {paymentTab === "digital" && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 mb-1">
                  Select your preferred digital payment app. Payment instructions will be sent to your email after placing the order.
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {DIGITAL_METHODS.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setDigitalMethod(method.id)}
                      className={`flex items-center gap-4 w-full px-5 py-4 rounded-xl border-2 transition text-left ${
                        digitalMethod === method.id
                          ? "border-black bg-gray-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-400"
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                        style={{ background: method.bg, color: method.color }}
                      >
                        {method.label[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{method.label}</p>
                        <p className="text-xs text-gray-400">Pay via {method.label}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                          digitalMethod === method.id ? "border-black bg-black" : "border-gray-300"
                        }`}
                      >
                        {digitalMethod === method.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  ))}
                </div>

                {digitalMethod && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-2">
                    <p className="text-xs text-blue-800 font-semibold mb-1">Next steps after placing order:</p>
                    <p className="text-xs text-blue-700">
                      You will receive an email with the {digitalMethod} payment details and the exact amount to send. Your order will be processed once payment is confirmed.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── Security Trust Bar ───────────────────────────────────────── */}
            <div className="flex items-center justify-center gap-4 py-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Lock className="w-3.5 h-3.5" />
                SSL Secured
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                256-bit Encrypted
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Check className="w-3.5 h-3.5" />
                Secure Checkout
              </div>
            </div>

            {/* ── Place Order Button ───────────────────────────────────────── */}
            <button
              type="submit"
              disabled={
                isSubmitting ||
                (paymentTab === "card" ? !canSubmitCard : !canSubmitDigital)
              }
              className="w-full bg-black text-white py-4 rounded-xl font-bold text-base hover:bg-gray-800 active:bg-gray-900 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing…
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Place Order &nbsp;·&nbsp; USD ${grandTotal.toFixed(2)}
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center leading-relaxed">
              By placing this order you agree to our terms and conditions. Your payment information is encrypted and never stored on our servers.
            </p>
          </form>
        </div>
      )}
    </main>
  );
}
