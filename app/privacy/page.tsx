import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="bg-deep-charcoal py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-white">Privacy Policy</h1>
        </div>
      </div>
      <div className="flex-1 bg-warm-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm prose-neutral">
          <h2 className="font-serif text-xl font-semibold text-charcoal">Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed">
            When you place an order, we collect your name and phone number to identify
            your order and contact you if needed. We do not collect delivery addresses,
            as we only offer dine-in and takeaway service.
          </p>

          <h2 className="font-serif text-xl font-semibold text-charcoal mt-8">Payment Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            We do not process online payments. Payment is collected at the restaurant
            using cash or UPI. We do not store card numbers, banking credentials,
            or any sensitive payment information online.
          </p>

          <h2 className="font-serif text-xl font-semibold text-charcoal mt-8">Order History</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your order details, including items ordered and prices, are stored to provide
            you with order tracking and for our records. Each order has a unique access
            token that allows you to view your order status securely.
          </p>

          <h2 className="font-serif text-xl font-semibold text-charcoal mt-8">Data Retention</h2>
          <p className="text-muted-foreground leading-relaxed">
            We retain order records for operational and accounting purposes as required
            by applicable law. You may request deletion of your personal data by
            contacting the restaurant.
          </p>

          <h2 className="font-serif text-xl font-semibold text-charcoal mt-8">Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            This website uses local storage to remember items in your cart as you browse.
            We do not use third-party tracking cookies or advertising networks.
          </p>

          <h2 className="font-serif text-xl font-semibold text-charcoal mt-8">Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            For privacy-related questions, please contact the restaurant directly.
            Contact details will be published once verified by the owner.
          </p>

          <p className="text-xs text-muted-foreground mt-8">
            Last updated: {new Date().getFullYear()}
          </p>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
