import api from "./api";
import { AxiosError } from "axios";

interface SubscriptionParams {
  userId: string;
  companyId?: string;
}

interface SubscriptionResponse {
  url: string;
}

export const subscriptions = async ({
  userId,
  companyId,
}: SubscriptionParams): Promise<SubscriptionResponse> => {
  try {
    const response = await api.post<SubscriptionResponse>(
      "/stripe/create-checkout-session",
      {
        userId,
        companyId,
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error on subscription:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to create subscription"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

