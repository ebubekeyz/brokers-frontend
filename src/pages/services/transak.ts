export async function initTransak() {
  if (typeof window === "undefined") return; // Prevent SSR

  // https://dashboard.transak.com/developers

  const transakModule: any = await import("@transak/transak-sdk");
  const TransakSDK = transakModule.default ?? transakModule; // works for both ESM/CJS

  const transak = new TransakSDK({
    apiKey: "YOUR_API_KEY",
    environment: "STAGING", // "PRODUCTION" for live
    defaultCryptoCurrency: "ETH",
    walletAddress: "",
    themeColor: "0000ff",
    email: "",
    redirectURL: "",
    hostURL: window.location.origin,
    widgetHeight: "550px",
    widgetWidth: "450px",
  });

  transak.init();

  transak.on(TransakSDK.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData: any) => {
    console.log("Order Successful:", orderData);
    transak.close();
  });
}
