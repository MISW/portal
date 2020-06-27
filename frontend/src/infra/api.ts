import ky from "ky-universal";
import type { Options } from "ky";
import { UserAllInfoJSON } from "user";

export class ApiClient {
  private http: typeof ky;
  constructor(baseUrl: string, options?: Options) {
    this.http = ky.create({
      prefixUrl: baseUrl,
      credentials: "include",
      ...options,
    });
  }

  async fetchCurrentProfile(): Promise<UserAllInfoJSON> {
    return await this.http.get("api/private/profile").json();
  }

  async logout(): Promise<void> {
    await this.http.post("api/private/logout", { json: {} }).json();
  }
}
