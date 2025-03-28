import Company from "../models/company.js";
import User from "../models/user.js";
import Subscription from "../models/Subscription.js";
import { SubscriptionData, SubscriptionTypes } from "../types/stripeTypes";

export class StripeRepositories {
  async verifyCompany(userId: string, companyId: string) {
    try {
      const company = await Company.findOne({ _id: companyId, userId });
      if (!company) {
        throw new Error("Company not found or not associated with user");
      }
      return company;
    } catch (error: any) {
      console.error("Error verifying company:", error.message);
      throw new Error(`Error verifying company: ${error.message}`);
    }
  }

  async updateUserSubscription(
    userId: string,
    subscription: SubscriptionTypes
  ) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { subscription } },
        { new: true }
      );
      console.log("Updated User:", updatedUser);
      if (!updatedUser) {
        throw new Error(`User with ID ${userId} not found`);
      }
    } catch (error: any) {
      console.error("Error updating user subscription:", error.message);
      throw new Error(`Error updating user subscription: ${error.message}`);
    }
  }

  async updateCompanySubscription(
    companyId: string,
    subscription: SubscriptionTypes
  ) {
    try {
      const updatedCompany = await Company.findByIdAndUpdate(
        companyId,
        { $set: { subscription } },
        { new: true }
      );
      if (!updatedCompany) {
        throw new Error(`Company with ID ${companyId} not found`);
      }
    } catch (error: any) {
      console.error("Error updating company subscription:", error.message);
      throw new Error(`Error updating company subscription: ${error.message}`);
    }
  }
  async storeSubscription(subscriptionData: SubscriptionData) {
    try {
      const newSubscription = await Subscription.create(subscriptionData);
      return newSubscription;
    } catch (error: any) {
      console.error("Error storing subscription:", error);
      throw new Error(`Error storing subscription: ${error.message}`);
    }
  }

  async updateSubscriptionStatus(subscriptionId: string, status: string) {
    try {
      const updatedSubscription = await Subscription.findOneAndUpdate(
        { subscriptionId },
        { status },
        { new: true }
      );
      if (!updatedSubscription) {
        throw new Error(`Subscription with ID ${subscriptionId} not found`);
      }
    } catch (error: any) {
      console.error("Error updating subscription status:", error.message);
      throw new Error(`Error updating subscription status: ${error.message}`);
    }
  }

  async revokeUserFeatures(userId: string) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $unset: { subscription: "" },
          $set: {
            features: {
              resumeHighlighting: false,
              unlimitedChat: false,
            },
          },
        },
        { new: true }
      );
      if (!updatedUser) {
        throw new Error(`User with ID ${userId} not found`);
      }
    } catch (error: any) {
      console.error("Error revoking user features:", error.message);
      throw new Error(`Error revoking user features: ${error.message}`);
    }
  }

  async revokeCompanyFeatures(companyId: string) {
    try {
      const updatedCompany = await Company.findByIdAndUpdate(
        companyId,
        {
          $unset: { subscription: "" },
          $set: {
            features: {
              unlimitedJobPosting: false,
              accessToAnalytics: false,
            },
          },
        },
        { new: true }
      );
      if (!updatedCompany) {
        throw new Error(`Company with ID ${companyId} not found`);
      }
      console.log("Company features revoked:", updatedCompany);
    } catch (error: any) {
      console.error("Error revoking company features:", error.message);
      throw new Error(`Error revoking company features: ${error.message}`);
    }
  }

  async grantUserFeatures(userId: string) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            features: {
              resumeHighlighting: true,
              unlimitedChat: true,
            },
          },
        },
        { new: true }
      );
      if (!updatedUser) {
        throw new Error(`User with ID ${userId} not found`);
      }
    } catch (error: any) {
      console.error("Error granting user features:", error.message);
      throw new Error(`Error granting user features: ${error.message}`);
    }
  }

  async grantCompanyFeatures(companyId: string) {
    try {
      const updatedCompany = await Company.findByIdAndUpdate(
        companyId,
        {
          $set: {
            features: {
              unlimitedJobPosting: true,
              accessToAnalytics: true,
            },
          },
        },
        { new: true }
      );
      if (!updatedCompany) {
        throw new Error(`Company with ID ${companyId} not found`);
      }
    } catch (error: any) {
      console.error("Error granting company features:", error.message);
      throw new Error(`Error granting company features: ${error.message}`);
    }
  }
}
