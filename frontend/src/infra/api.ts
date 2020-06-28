import ky from "ky-universal";
import { Options } from "ky";
import { UserAllInfoJSON } from "user";
import { toCamelCase } from "./converter";
import { User } from "models/user";

export class ApiClient {
  private http: typeof ky;
  constructor(baseUrl: string, options?: Options) {
    this.http = ky.create({
      prefixUrl: baseUrl,
      credentials: "include",
      ...options,
    });
  }

  async fetchCurrentProfile(): Promise<User> {
    return toCamelCase(
      await this.http.get("api/private/profile").json()
    ) as User;
  }

  async logout(): Promise<void> {
    await this.http.post("api/private/logout", { json: {} }).json();
  }
}
