import React from "react";
import { Transak } from "@transak/transak-sdk";
import { useAppSelector } from "../hooks";
import { formatter } from "../utils/utils";

interface TransakWidgetProps {
  walletAddress?: string;
  mode: "BUY" | "SELL";
  cashBalance: number;
  Swal: any; // Pass in SweetAlert2 instance
}

const TransakWidget: React.FC<TransakWidgetProps> = ({
  mode,
  cashBalance,
  Swal
}) => {
  const user = useAppSelector((state) => state.userState.user);

  const openTransak = (amount: number) => {
    const transak = new Transak({
      apiKey: "199e0c9b-9315-4e82-a14d-8bca37d6d94e", // staging key
      environment: "STAGING",
      walletAddress: user?.user.walletAddress || "",
      themeColor: "000000",
      fiatCurrency: "USD",
      fiatAmount: amount, // ✅ pass the validated amount
      email: user?.user.email,
      hostURL: window.location.origin,
      redirectURL: "",
      productsAvailed: mode,
      defaultCryptoCurrency: "ETH",
      termsAndConditions: "https://brokers-main.netlify.app/terms"
    });

    transak.init();

    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log(`${mode} order successful:`, orderData);
      transak.close();
    });
  };

  const handleClick = (event: React.MouseEvent) => {
    // ✅ First check if user has *any* balance
    if (cashBalance <= 0) {
      event.preventDefault();
      Swal.fire({
        icon: "warning",
        title: "Insufficient Balance",
        text: "Please fund your account before making a transaction.",
        confirmButtonText: "OK"
      });
      return;
    }

    // ✅ Prompt for amount
    const amount = parseFloat(prompt("Enter amount in USD") || "0");

    if (isNaN(amount) || amount <= 0) {
      Swal.fire("Invalid Amount", "Please enter a valid number", "warning");
      return;
    }

    // ✅ Check against available balance
    if (amount > cashBalance) {
      Swal.fire(
        "Insufficient Balance",
        `You only have ${formatter.format(cashBalance)} available.`,
        "error"
      );
      return;
    }

    // ✅ All good → open Transak with the amount
    openTransak(amount);
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-lg text-white ${
        mode === "SELL" ? "bg-red-600" : "bg-green-600"
      }`}
    >
      {mode === "SELL" ? "Sell" : "Buy"}
    </button>
  );
};

export default TransakWidget;
