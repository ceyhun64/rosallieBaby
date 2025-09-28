import React from "react";
import Navbar from "@/components/layout/navbar";
import Topbar from "@/components/layout/topbar";
import Footer from "@/components/layout/footer";

export default function ConsumerRightsPage() {
  return (
    <div>
      <Topbar />

      <Navbar />
      <div className="min-h-screen bg-gray-50 text-gray-800 p-6 md:p-12">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            CONSUMER RIGHTS – WITHDRAWAL – CANCELLATION AND RETURN CONDITIONS
          </h1>

          <div className="space-y-6 text-gray-700">
            <h2 className="font-bold">GENERAL</h2>
            <p>
              When you place an order on our website electronically, you are
              considered to have accepted the pre-information form and the
              distance sales agreement provided. Buyers are subject to Law No.
              6502 on the Protection of the Consumer and related regulations.
              Shipping costs are the responsibility of the buyer.
            </p>
            <p>
              The purchased product will be delivered to the address specified
              by the buyer within the legal period of 30 days. If the product is
              not delivered, the buyer may terminate the agreement. Delivered
              products must be complete, meet the specified qualities, and
              include documents such as warranty and user manuals if available.
            </p>
            <p>
              If it becomes impossible to sell the product, the seller must
              inform the buyer in writing within 3 days and refund the total
              amount within 14 days.
            </p>

            <h2 className="font-bold">IF THE PURCHASE PRICE IS NOT PAID</h2>
            <p>
              If the buyer does not pay the price or cancels the bank record,
              the seller's obligation to deliver the product ends.
            </p>

            <h2 className="font-bold">UNAUTHORIZED USE OF CREDIT CARD</h2>
            <p>
              After the product is delivered, if the credit card used for
              payment is fraudulently used by unauthorized persons and the bank
              does not pay the seller, the buyer must return the product to the
              seller within 3 days.
            </p>

            <h2 className="font-bold">
              PRODUCT NOT DELIVERED DUE TO UNFORESEEABLE CIRCUMSTANCES
            </h2>
            <p>
              If delivery cannot be made due to force majeure, the buyer will be
              informed. The buyer may cancel the order, request a similar
              product, or postpone delivery. In case of cancellation, the
              payment will be refunded within 14 days.
            </p>

            <h2 className="font-bold">BUYER’S INSPECTION RESPONSIBILITY</h2>
            <p>
              The buyer must inspect the product before accepting it. Damaged
              products should not be accepted. If the withdrawal right is to be
              exercised, the product must not be used. The invoice must also be
              included in the return.
            </p>

            <h2 className="font-bold">RIGHT OF WITHDRAWAL</h2>
            <p>
              The buyer may exercise the right of withdrawal within 14 days from
              the delivery date without providing any reason or bearing any
              legal responsibility. Withdrawal must be notified through the
              following contact details:
            </p>
            <ul className="list-disc pl-6">
              <li>COMPANY NAME</li>
              <li>ADDRESS</li>
              <li>EMAIL</li>
              <li>PHONE</li>
              <li>FAX</li>
            </ul>

            <h2 className="font-bold">WITHDRAWAL PERIOD</h2>
            <p>
              For services, the withdrawal period is 14 days from the date of
              contract signing. If the service has started with the consumer’s
              consent before the period ends, the right of withdrawal cannot be
              used.
            </p>

            <h2 className="font-bold">HOW TO USE THE RIGHT OF WITHDRAWAL</h2>
            <p>
              The returned product must be delivered with its invoice, return
              form, box, packaging, and accessories, intact and undamaged. For
              corporate invoices, a return invoice must be issued.
            </p>

            <h2 className="font-bold">RETURN CONDITIONS</h2>
            <p>
              The seller is obliged to refund the total amount within 10 days
              from receiving the withdrawal notice and to receive the product
              within 20 days. If there is damage due to the buyer’s fault, the
              buyer must compensate the seller.
            </p>

            <h2 className="font-bold">PRODUCTS THAT CANNOT BE WITHDRAWN</h2>
            <p>
              Products made according to personal needs, hygienic items
              (underwear, swimsuits, cosmetics, etc.), perishable products,
              opened packaging, digital content, software, CDs/DVDs, books, and
              similar items cannot be withdrawn.
            </p>

            <h2 className="font-bold">DEFAULT AND LEGAL CONSEQUENCES</h2>
            <p>
              If the buyer defaults on credit card payments, they are
              responsible for paying interest under the bank agreement. The bank
              may take legal action, and the buyer is liable for the seller’s
              losses caused by delayed payment.
            </p>

            <h2 className="font-bold">PAYMENT AND DELIVERY</h2>
            <p>
              Payment can be made via bank transfer, EFT, or credit card. For
              online payments, the amount will be charged from the credit card
              at the end of the order.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
