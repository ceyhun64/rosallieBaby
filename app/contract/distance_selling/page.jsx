import React from "react";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function DistanceSalesAgreementPage() {
  return (
    <div>
      <Topbar />
      <Navbar />
      <div className="min-h-screen bg-gray-50 text-gray-800 p-6 md:p-12">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            DISTANCE SALES AGREEMENT
          </h1>

          <p className="text-sm text-gray-600 mb-8">
            Please read the following agreement carefully in accordance with the
            applicable law. Every customer who makes a purchase from our website
            is deemed to have read and accepted all terms of this agreement
            without any further notice.
          </p>

          <section className="space-y-6">
            <div>
              <h2 className="font-bold">ARTICLE 1: PARTIES TO THE AGREEMENT</h2>
              <p>
                <strong>SELLER:</strong> INSERT SELLER NAME HERE <br />
                <strong>ADDRESS:</strong> INSERT SELLER ADDRESS HERE <br />
                <strong>PHONE:</strong> INSERT SELLER PHONE HERE <br />
                <strong>EMAIL:</strong> INSERT SELLER EMAIL HERE
              </p>
              <p className="mt-2">
                <strong>BUYER:</strong> Customer (person making a purchase from
                the website INSERT SELLER DOMAIN HERE)
              </p>
            </div>

            <div>
              <h2 className="font-bold">ARTICLE 2: SUBJECT OF THE AGREEMENT</h2>
              <p>
                The sale and delivery of the goods/services ordered
                electronically from the seller's website, and the rights and
                obligations of the parties, are governed by Law No. 6502 on the
                Protection of the Consumer and the Distance Sales Regulation.
              </p>
            </div>

            <div>
              <h2 className="font-bold">ARTICLE 3: DELIVERY</h2>
              <p>
                The ordered product/service will be delivered to the address
                specified by the buyer within 30 days at the latest. If the
                package is damaged during delivery, the buyer must document it
                with the shipping company before accepting the product.
              </p>
            </div>

            <div>
              <h2 className="font-bold">ARTICLE 4: GENERAL PROVISIONS</h2>
              <p>
                The buyer accepts the characteristics, price, payment methods,
                and delivery terms of the products shown on the website. Payment
                must be made in full before receiving the product. Withdrawal
                and return rights are valid within the framework of applicable
                legislation.
              </p>
            </div>

            <div>
              <h2 className="font-bold">ARTICLE 5: RIGHT OF WITHDRAWAL</h2>
              <p>
                The buyer has the right to return the delivered product within
                14 days without opening it. Withdrawal rights do not apply to
                opened or used products.
              </p>
            </div>

            <div>
              <h2 className="font-bold">
                ARTICLE 6: PROTECTION OF PERSONAL DATA
              </h2>
              <p>
                Information provided by the buyer is protected under the
                Personal Data Protection Law (KVKK) and will only be used for
                the fulfillment of this agreement.
              </p>
            </div>

            <div>
              <h2 className="font-bold">ARTICLE 7: DISPUTES</h2>
              <p>
                In case of disputes arising from this agreement, Istanbul
                Anatolian Consumer Courts and Consumer Arbitration Committees
                shall have jurisdiction.
              </p>
            </div>
          </section>

          <p className="mt-8 text-sm text-gray-600">
            The buyer is deemed to have accepted all terms of this agreement
            upon completing payment for the order on the website.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
