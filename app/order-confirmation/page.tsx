"use client";
import { Check, Package, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function OrderConfirmationPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
        {/* Success icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Request Sealed! 💜</h1>
        <p className="text-gray-600 text-sm mb-8">
          Thank you for your order. We have received your request and will
          contact you shortly with payment details and shipping information.
        </p>

        {/* Steps */}
        <div className="space-y-4 mb-8 text-left">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 bg-[#00B8D4]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Mail className="w-4 h-4 text-[#00B8D4]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Check your email</p>
              <p className="text-xs text-gray-500 mt-0.5">
                A confirmation and payment instructions will be sent to your email address.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 bg-[#00B8D4]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Package className="w-4 h-4 text-[#00B8D4]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Processing & Shipping</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Once payment is confirmed, your order will be processed and shipped. Estimated delivery: 7–14 business days.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition"
        >
          Continue Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}
