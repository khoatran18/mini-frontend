
"use client";
import withAuth from "@/lib/with-auth";

const BuyerDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Buyer Dashboard</h1>
      {/* Add buyer-specific dashboard content here */}
    </div>
  );
};

export default withAuth(BuyerDashboard, ["buyer"]);
