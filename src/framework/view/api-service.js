export default class ApiService {
    constructor(baseUrl) {
      this._baseUrl = baseUrl;
    }
  
    async _load({ url, method = 'GET', body = null, headers = new Headers() }) {
      const response = await fetch(`${this._baseUrl}/${url}`, {
        method,
        body,
        headers,
      });
  
      try {
        ApiService._checkStatus(response);
        return response;
      } catch (error) {
        ApiService._handleError(error);
      }
    }
  
    static async parseResponse(response) {
      return await response.json();
    }
  
    static _checkStatus(response) {
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
    }
  
    static _handleError(error) {
      throw error;
    }
  }
  