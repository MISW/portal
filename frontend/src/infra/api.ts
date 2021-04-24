import ky from "ky-universal";
import { Options } from "ky";
import { toCamelCase, toSnakeCase } from "./converter";
import { decodeCard } from "./decode";
import {
  User,
  UpdateUserProfileInput,
  SignupInput,
  PaymentStatus,
} from "models/user";
import { Period, EmailKind, EmailTemplate } from "models/appconfig";
import { UpdateAppConfigInput } from "./type";

export const createApiClient = (baseUrl: string, options?: Options) => {
  const http = ky.create({
    prefixUrl: baseUrl,
    ...options,
  });
  return Object.freeze({
    // Public Endpoints
    async signup(input: Readonly<SignupInput>): Promise<void> {
      await http.post("api/public/signup", { json: toSnakeCase(input) });
    },

    async verifyEmail(token: string): Promise<void> {
      await http.post("api/public/verify_email", { json: { token } });
    },

    async login(): Promise<{ redirectUrl: string }> {
      const res = await http
        .post("api/public/login", { json: {} })
        .json<{ redirect_url: string }>();
      return {
        redirectUrl: res.redirect_url,
      };
    },

    async processCallback(code: string, state: string) {
      await http.post("api/public/callback", { json: { code, state } });
    },

    async fetchCard(id: number) {
      const json = await http.get(`api/public/card/${id}`).json();
      return decodeCard(json);
    },

    // Private Endpoints
    async logout(): Promise<void> {
      await http.post("api/private/logout", { json: {} }).json();
    },

    async fetchCurrentProfile(): Promise<User> {
      return toCamelCase(await http.get("api/private/profile").json()) as User;
    },

    async updateCurrentProfile(
      input: Readonly<UpdateUserProfileInput>
    ): Promise<User> {
      return toCamelCase(
        await http
          .post("api/private/profile", { json: toSnakeCase(input) })
          .json()
      ) as User;
    },

    async fetchCurrentPaymentStatuses(): Promise<PaymentStatus[]> {
      const res = await http
        .get("api/private/profile/payment_statuses")
        .json<{ payment_statuses: unknown[] }>();
      return toCamelCase(res.payment_statuses) as PaymentStatus[];
    },

    // Management Endpoints
    async fetchAllUsers(): Promise<User[]> {
      return (toCamelCase(
        await http.get("api/private/management/users").json()
      ) as { users: User[] }).users;
    },

    async fetchUserById(id: number): Promise<User | undefined> {
      try {
        const res = await http
          .get("api/private/management/user", {
            searchParams: { user_id: `${id}` },
          })
          .json<{ user: unknown }>();
        return toCamelCase(res.user) as User;
      } catch (e) {
        if (e instanceof ky.HTTPError) {
          if (e.response.status === 404) return undefined;
        }
        throw e;
      }
    },

    async fetchPaymentPeriodConfig(): Promise<Period> {
      const res = await http
        .get("api/private/management/config", {
          searchParams: { kind: "payment_period" },
        })
        .json<{ payment_period: Period }>();
      return res.payment_period;
    },

    async fetchCurrentPeriodConfig(): Promise<Period> {
      const res = await http
        .get("api/private/management/config", {
          searchParams: { kind: "current_period" },
        })
        .json<{ current_period: Period }>();
      return res.current_period;
    },

    async fetchEmailTemplateConfig(kind: EmailKind): Promise<EmailTemplate> {
      const res = await http
        .get("api/private/management/config", {
          searchParams: { kind: "email_template", email_kind: kind },
        })
        .json<EmailTemplate>();
      return {
        subject: res.subject,
        body: res.body,
      };
    },

    async updateAppConfig(input: UpdateAppConfigInput): Promise<void> {
      await http
        .post("api/private/management/config", { json: toSnakeCase(input) })
        .json();
    },

    async addPaymentStatus(targetUserId: number): Promise<void> {
      try {
        await http
          .put("api/private/management/payment_status", {
            json: { user_id: targetUserId },
          })
          .json();
      } catch (e) {
        if (e instanceof ky.HTTPError) {
          if (e.response.status === 409) return;
        }
        throw e;
      }
    },

    async deletePaymentStatus(targetUserId: number): Promise<void> {
      await http.delete("api/private/management/payment_status", {
        json: { user_id: targetUserId },
      });
    },

    async inviteToSlack(): Promise<void> {
      await http.post("api/private/management/slack/invite");
    },

    async remindPayment(): Promise<void> {
      await http.post("api/private/management/remind_payment");
    },
  });
};

export type ApiClient = ReturnType<typeof createApiClient>;
