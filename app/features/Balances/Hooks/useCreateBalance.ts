import { useState, useContext } from "react";
import { message } from "antd";
import { UserContext } from "~/context/UserContext";

export function useCreateBalance(clientId: string, onSuccess: () => void) {
  const [submitting, setSubmitting] = useState(false);
  const user = useContext(UserContext);

  const createBalance = async (values: any) => {
    setSubmitting(true);
    try {
      const retainerPayload = {
        amount: Number(values.amount),
        date_activated: values.date_activated,
        is_credit: values.is_credit,
        created_by_id: user?.id,
        client_id: clientId,
        note: values.note || undefined,
      };

      const formData = new FormData();
      formData.append("retainer", JSON.stringify(retainerPayload));

      const res = await fetch("/api/retainers", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create retainer");

      message.success("Balance created successfully");
      onSuccess();
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return { createBalance, submitting };
}