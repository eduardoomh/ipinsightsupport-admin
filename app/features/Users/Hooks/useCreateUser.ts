import { useState } from "react";
import { message } from "antd";

export function useCreateUser(onSuccess: () => void) {
  const [submitting, setSubmitting] = useState(false);

  const createUser = async (values: any) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("user", JSON.stringify(values));

      const res = await fetch(`/api/users`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        message.success("User created successfully. An email has been sent to set the password.");
        onSuccess();
      } else {
        const errorData = await res.json();
        message.error(errorData.message || "Error creating user");
      }
    } catch (err) {
      message.error("Error connecting to the server");
    } finally {
      setSubmitting(false);
    }
  };

  return { submitting, createUser };
}