import ky from "ky-universal";
import { Options } from "ky";
import { toCamelCase, toSnakeCase } from "./converter";
import { User, UpdateUserProfileInput, PaymentStatus } from "models/user";
import { Period, EmailKind, EmailTemplate } from "models/appconfig";
import { UpdateAppConfigInput } from "./type";

export class ApiClient {
  private http: typeof ky;
  constructor(baseUrl: string, options?: Options) {
    this.http = ky.create({
      prefixUrl: baseUrl,
      credentials: "include",
      ...options,
    });
  }

  // Private Endpoints
  async logout(): Promise<void> {
    await this.http.post("api/private/logout", { json: {} }).json();
  }

  async fetchCurrentProfile(): Promise<User> {
    return toCamelCase(
      await this.http.get("api/private/profile").json()
    ) as User;
  }

  async updateCurrentProfile(
    input: Readonly<UpdateUserProfileInput>
  ): Promise<User> {
    return toCamelCase(
      await this.http
        .post("api/private/profile", { json: toSnakeCase(input) })
        .json()
    ) as User;
  }

  async fetchCurrentPaymentStatuses(): Promise<readonly PaymentStatus[]> {
    const res = await this.http
      .get("api/private/profile/payment_statuses")
      .json<{ payment_statuses: unknown[] }>();
    return toCamelCase(res.payment_statuses) as PaymentStatus[];
  }

  // Management Endpoints
  async fetchAllUsers(): Promise<User[]> {
    return (toCamelCase(
      await this.http.get("api/private/management/users").json()
    ) as { users: User[] }).users;
  }

  async fetchUserById(id: number): Promise<User | undefined> {
    try {
      const res = await this.http
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
  }

  async fetchPaymentPeriodConfig(): Promise<Period> {
    const res = await this.http
      .get("api/private/management/config", {
        searchParams: { kind: "payment_period" },
      })
      .json<{ payment_period: Period }>();
    return res.payment_period;
  }

  async fetchCurrentPeriodConfig(): Promise<Period> {
    const res = await this.http
      .get("api/private/management/config", {
        searchParams: { kind: "current_period" },
      })
      .json<{ current_period: Period }>();
    return res.current_period;
  }

  async fetchEmailTemplateConfig(kind: EmailKind): Promise<EmailTemplate> {
    const res = await this.http
      .get("api/private/management/config", {
        searchParams: { kind: "email_template", email_kind: kind },
      })
      .json<EmailTemplate>();
    return {
      subject: res.subject,
      body: res.body,
    };
  }

  async updateAppConfig(input: UpdateAppConfigInput): Promise<void> {
    await this.http
      .post("api/private/management/config", { json: toSnakeCase(input) })
      .json();
  }
  async addPaymentStatus(targetUserId: number): Promise<void> {
    try {
      await this.http
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
  }

  async deletePaymentStatus(targetUserId: number): Promise<void> {
    await this.http.delete("api/private/management/payment_status", {
      json: { user_id: targetUserId },
    });
  }
}
