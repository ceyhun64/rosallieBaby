import React from "react";
import Navbar from "@/components/layout/navbar";
import Topbar from "@/components/layout/topbar";
import Footer from "@/components/layout/footer";

export default function PrivacyPolicyPage() {
  return (
    <div>
      <Topbar />
      <Navbar />
      <div className="min-h-screen bg-gray-50 text-gray-800 p-6 md:p-12">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            PRIVACY AND SECURITY POLICY
          </h1>

          <div className="space-y-6 text-gray-700">
            <p>
              The website <strong>INSERT SELLER DOMAIN HERE</strong>, operated
              by <strong>INSERT SELLER TAX NAME HERE</strong> at{" "}
              <strong>INSERT SELLER ADDRESS HERE</strong>, respects the privacy
              of your information and explains below how your information is
              used.
            </p>

            <p>
              Providing personal information such as name, surname, gender, age,
              username and password, email, ID, address, credit/bank card
              numbers, expiration date, security code, and order recipient
              details—among others—is required depending on the transaction.
              This information is protected according to strict security and
              privacy standards.
            </p>

            <p>
              You can visit our website pages without providing personal
              information, view our products and services, read reports, and
              benefit from human resources and other detailed services. If you
              provide personal information, it will not be shared with third
              parties without your consent.
            </p>

            <p>
              Customer information may only be disclosed if requested by
              official authorities in accordance with legal procedures. Only you
              can access and modify the information you provide in the system.
            </p>

            <p>
              Our systems are continuously improved, and this Privacy Policy may
              be updated from time to time. Continued use of our website
              constitutes acceptance of these changes.
            </p>

            <h2 className="font-bold text-lg mt-8">PAYMENT SECURITY</h2>
            <p>
              Our payment infrastructure is secured by{" "}
              <strong>Sipay POS</strong>. Card security is ensured through PCI
              DSS-compliant infrastructure and SSL-certified payment pages.
            </p>

            <h2 className="font-bold text-lg mt-8">FRAUD PREVENTION</h2>
            <p>
              Advanced filtering systems and monitoring personnel check
              suspicious transactions to prevent online payment fraud.
            </p>

            <h2 className="font-bold text-lg mt-8">CARD SECURITY</h2>
            <p>
              Payment processes are securely performed thanks to SSL-certified
              payment pages and PCI-DSS compliance.
            </p>

            <h2 className="font-bold text-lg mt-8">
              SECURITY MEASURES OF OUR E-COMMERCE SYSTEM
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Firewall</li>
              <li>256-Bit SSL Certificate</li>
              <li>Custom Encryption Application</li>
            </ul>

            <p className="mt-6">
              For any questions regarding this Privacy Policy, you can contact
              us via email at <strong>INSERT SELLER EMAIL HERE</strong> or by
              phone at <strong>INSERT SELLER PHONE HERE</strong>.
            </p>

            <p>
              You can also contact us in writing at the following address:{" "}
              <br />
              <strong>INSERT SELLER TAX NAME HERE</strong> <br />
              Attn: Customer Relations Department <br />
              <strong>INSERT SELLER ADDRESS HERE</strong>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
