import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="bg-deep-charcoal py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-white">Terms of Service</h1>
        </div>
      </div>
      <div className="flex-1 bg-warm-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm prose-neutral">
          <h2 className="font-serif text-xl font-semibold text-charcoal">Orders</h2>
          <p className="text-muted-foreground leading-relaxed">
            When you place an order through this website, it is a request for service.
            All orders are subject to acceptance by Star Family Restaurant. We reserve
            the right to decline or cancel any order.
          </p>

          <h2 className="font-serif text-xl font-semibold text-charcoal mt-8">Pricing</h2>
          <p className="text-muted-foreground leading-relaxed">
            Prices displayed on this website are indicative and subject to verification.
            The final price of your order is confirmed by our staff. We reserve the right
            to update prices without prior notice. If a price has changed since you placed
            your order, our staff will inform you before confirming.
          </p>

          <h2 className="font-serif text-xl font-semibold text-charcoal mt-8">Payment</h2>
          <p className="text-muted-foreground leading-relaxed">
            Payment is collected at the restaurant. We accept cash and UPI.
            Online payment is not available at this time. A UPI reference number
            alone does not constitute proof of payment; payment must be verified
            by our staff.
          </p>

          <h2 className="font-serif text-xl font-semibold text-charcoal mt-8">Service Availability</h2>
          <p className="text-muted-foreground leading-relaxed">
            We offer dine-in and takeaway services only. Home delivery is not available
            in this release. We reserve the right to modify our service offerings at any time.
          </p>

          <h2 className="font-serif text-xl font-semibold text-charcoal mt-8">Order Cancellation</h2>
          <p className="text-muted-foreground leading-relaxed">
            Orders may be cancelled by the restaurant at any stage of preparation.
            If an order is cancelled, any payment made will be refunded.
          </p>

          <h2 className="font-serif text-xl font-semibold text-charcoal mt-8">Availability of Items</h2>
          <p className="text-muted-foreground leading-relaxed">
            Menu items may be unavailable at any time due to ingredient availability
            or other operational reasons. Items without confirmed prices cannot be ordered.
          </p>

          <h2 className="font-serif text-xl font-semibold text-charcoal mt-8">Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            Star Family Restaurant is not liable for any indirect or consequential losses
            arising from the use of this website or the services provided.
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
