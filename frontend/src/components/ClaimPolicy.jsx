import React from "react";

const claimableMajor = [
  "Damage to the sole",
  "Damage to the upper",
  "Pasting issues (sole/upper separation)",
];

const claimableMinor = [
  "Stitching issues",
  "Pasting issue (over-pasted)",
];

const unclaimableDefects = [
  "Items purchased during sales with 50% discount or above are not eligible for claims.",
  "Products showing signs of excessive wear, such as vanished sole prints or misshapen uppers.",
  "Wrinkled products are not eligible for claims, as leather naturally wrinkles.",
  "Shoes that have lost their shape due to use (not a manufacturing defect).",
  "Products scratched through use.",
  "Damage to the sole or upper caused by fire, burns, heat, etc.",
  "Intentional pulling of the sole and upper resulting in adhesive issues.",
];

const claimSteps = [
  <>
    We offer a <strong>30-day claim policy</strong> for any of the issues listed
    above.
  </>,
  <>
    If you encounter any issues, contact our helpline at{" "}
    <a
      href="tel:123456"
      className="font-semibold text-gray-900 underline underline-offset-4"
    >
      12345
    </a>{" "}
    for assistance.
  </>,
  "Our team will provide you with a return label after you contact our helpline.",
  <>
    Print the return label and pack the parcel securely. Drop it off at the
    courier office specified by our team. Obtain a receiving on a copy of the
    shared label and send it to us on WhatsApp at{" "}
    <a
      href="https://wa.me/12345"
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-gray-900 underline underline-offset-4"
    >
      12345
    </a>
    
  </>,
  "Once the parcel reaches our warehouse, our Quality Control team will inspect the product.",
  <>
    If your claim is approved as a <strong>Minor Defect</strong>, the product
    will be repaired and shipped back to you via Cash on Delivery, with a
    shipping fee of <strong>PKR 200</strong>.
  </>,
  <>
    If your claim is approved as a <strong>Major Defect</strong>, you will
    receive a voucher for the amount you paid.
  </>,
  "Vouchers can be used at any time and have no expiration date.",
  "The full voucher amount must be used in one transaction. Partial usage is not permissible.",
  "Cash refunds are not applicable to any orders.",
  "Vouchers cannot be combined with other promotional vouchers.",
];

const DefectList = ({ items }) => (
  <ul className="space-y-3">
    {items.map((item) => (
      <li key={item} className="flex gap-3 text-sm leading-6 text-gray-600 sm:text-base">
        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-900" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const ClaimPolicy = () => {
  return (
    <main className="min-h-screen bg-white px-5 py-14 font-[Arial,sans-serif] text-gray-800 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 border-b border-gray-200 pb-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
            Customer Support
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Claim Policy
          </h1>
          <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
            Please review our claim eligibility requirements and the steps to
            submit a product claim.
          </p>
        </header>

        <div className="mb-10 border-l-4 border-gray-900 bg-gray-50 p-5 sm:p-6">
          <h2 className="mb-2 font-bold text-gray-900">
            Important Eligibility Notice
          </h2>
          <p className="text-sm leading-7 text-gray-600 sm:text-base">
            Items purchased during sales with a{" "}
            <strong className="text-gray-900">50% discount or above</strong>{" "}
            are not eligible for claims.
          </p>
        </div>

        <section className="mb-10">
          <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">
            Claimable Defects
          </h2>

          <div className="mb-5 border border-gray-200 p-5 sm:p-6">
            <h3 className="mb-4 font-bold text-gray-900">
              Major Defects
              <span className="mt-1 block text-sm font-normal text-gray-500">
                Unrepairable manufacturing faults
              </span>
            </h3>
            <DefectList items={claimableMajor} />
          </div>

          <div className="border border-gray-200 p-5 sm:p-6">
            <h3 className="mb-4 font-bold text-gray-900">
              Minor Defects
              <span className="mt-1 block text-sm font-normal text-gray-500">
                Repairable faults
              </span>
            </h3>
            <DefectList items={claimableMinor} />
          </div>
        </section>

        <section className="mb-10 border-t border-gray-200 pt-8">
          <h2 className="mb-5 text-xl font-bold text-gray-900 sm:text-2xl">
            Unclaimable Defects
          </h2>
          <DefectList items={unclaimableDefects} />
        </section>

        <section className="mb-10 border-t border-gray-200 pt-8">
          <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">
            How to File a Claim
          </h2>

          <ol className="space-y-5">
            {claimSteps.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm leading-7 text-gray-600 sm:text-base">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-8 border border-gray-200 p-5 sm:p-6">
          <h2 className="mb-3 text-lg font-bold text-gray-900">
            Processing Time
          </h2>
          <p className="text-sm leading-7 text-gray-600 sm:text-base">
            The claim process can take up to{" "}
            <strong className="text-gray-900">10–15 business days</strong>.
            The final decision will be made by the Quality Control Department.
          </p>
        </section>

        <div className="space-y-4 border-t border-gray-200 pt-6 text-sm leading-7 text-gray-600 sm:text-base">
          <p>
            This policy is valid for <strong className="text-gray-900">online customers only</strong>.
          </p>
          <p>
            If you have any further questions or concerns, please contact our
            customer service team at{" "}
            <a
              href="tel:03460000128"
              className="font-semibold text-gray-900 underline underline-offset-4"
            >
              12345
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
};

export default ClaimPolicy;
