import { useState, useEffect } from "react";
import { s as supabase } from "./supabase-xo2Ne9iT.js";
function usePayment() {
  const [orderData, setOrderData] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [timeLeft, setTimeLeft] = useState(600);
  const initializePayment = async (prescriptionId, patientId) => {
    setPaymentStatus("loading");
    try {
      const orderRes = await fetch(`${"http://localhost:5000"}/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prescription_id: prescriptionId, patient_id: patientId })
      });
      const order = await orderRes.json();
      if (order.error) throw new Error(order.error);
      setOrderData(order);
      try {
        const qrRes = await fetch(`${"http://localhost:5000"}/payment/create-qr`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: order.order_id,
            prescription_id: prescriptionId,
            amount_paise: order.amount_paise
          })
        });
        const qr = await qrRes.json();
        if (qr.qr_image_url) {
          setQrData(qr);
        }
      } catch (qrError) {
        console.warn("QR creation skipped:", qrError);
      }
      setPaymentStatus("awaiting");
      setTimeLeft(600);
    } catch (error) {
      console.error("Payment Init Error:", error);
      setPaymentStatus("failed");
    }
  };
  useEffect(() => {
    let timer;
    if (paymentStatus === "awaiting" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setPaymentStatus("expired");
            return 0;
          }
          return prev - 1;
        });
      }, 1e3);
    }
    return () => clearInterval(timer);
  }, [paymentStatus, timeLeft]);
  useEffect(() => {
    if (!(orderData == null ? void 0 : orderData.order_id) || paymentStatus === "paid") return;
    const channel = supabase.channel("payment-status").on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "payments",
        filter: `razorpay_order_id=eq.${orderData.order_id}`
      },
      (payload) => {
        if (payload.new.status === "paid") {
          setPaymentStatus("paid");
        }
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderData, paymentStatus]);
  const payByCard = () => {
    if (!orderData || !window.Razorpay) return;
    const options = {
      key: orderData.key_id,
      amount: orderData.amount_paise,
      currency: orderData.currency,
      name: "MEDIKIOSK",
      description: "Medicine Payment",
      order_id: orderData.order_id,
      handler: async (response) => {
        const verifyRes = await fetch(`${"http://localhost:5000"}/payment/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            prescription_id: orderData.prescription_id
          })
        });
        const result = await verifyRes.json();
        if (result.success) {
          setPaymentStatus("paid");
        } else {
          setPaymentStatus("failed");
        }
      },
      theme: { color: "#1a3a2a" }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  return {
    orderData,
    qrData,
    paymentStatus,
    timeLeft,
    initializePayment,
    payByCard
  };
}
export {
  usePayment as u
};
