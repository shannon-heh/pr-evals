// Adapted from https://github.com/vr2amesh/COS333-API-Code-Examples/blob/master/ActiveDirectory/python/req_lib.py

// Create ReqLib object to access Princeton APIs
export class ReqLib {
  ACCESS_TOKEN = null;
  REFRESH_TOKEN_URL =
    "https://api.princeton.edu:443/token?grant_type=client_credentials";

  // Refresh API access token
  async refreshToken() {
    JSON.stringify({ grant_type: "client_credentials" });
    const headers = {
      Authorization: `Basic ${process.env.API_AUTHORIZATION_STRING}`,
    };
    const params = {
      method: "POST",
      headers: headers,
    };
    const res = await fetch(this.REFRESH_TOKEN_URL, params);
    return res.json();
  }

  // Returns data from calling endpoint
  async getJSON(baseURL: string, endpoint: string, ...kwargs) {
    return await this.refreshToken().then((res) => {
      this.ACCESS_TOKEN = res["access_token"];
      return this.getJSONHelper(baseURL, endpoint, kwargs[0]);
    });
  }

  // Helper method to call endpoint
  async getJSONHelper(baseURL: string, endpoint: string, args: Object) {
    let url = baseURL + endpoint + "?";
    const query = Object.keys(args)
      .map(
        (k) => encodeURIComponent(k) + "=" + encodeURIComponent(args[k])
      )
      .join("&");
    const headers = {
      Authorization: `Bearer ${this.ACCESS_TOKEN}`,
    };
    const params = {
      method: "GET",
      headers: headers,
    };
    const res = await fetch(url + query, params);
    return res.json();
  }
}
