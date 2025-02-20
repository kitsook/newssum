import Logger from "./Logger";
import Suggestion from "../models/Suggestion";

export default class SuggestionsApi {
  static readonly baseUrl = "https://news-sum-sug.uc.r.appspot.com";

  static async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(SuggestionsApi.baseUrl + "/health", {
        "headers": {
          "Content-Type": "application/json",
        },
        "method": "GET",
      });
      if (response.ok) {
        return true;
      }
    } catch (err: unknown) {
      Logger.log("Failed to check if suggestion is available: ");
      if (typeof err === "string") {
        Logger.log(err);
      } else if (err instanceof Error) {
        Logger.log(err.message);
      }
    }
    return false;
  }

  static async getSuggestions(query_str: string): Promise<Suggestion[]> {
    try {
      const response = await fetch(SuggestionsApi.baseUrl + "/search", {
        "headers": {
          "Content-Type": "application/json",
        },
        "method": "POST",
        "body": JSON.stringify({ "query_str": query_str})
      });
      if (response.ok) {
        const suggestions: Suggestion[] = <Suggestion[]>(await response.json())["results"];
        return suggestions;
      } else {
        Logger.log("Failed to fetch suggestions " + response.status + ": " + response.statusText);
      }
    } catch (err: unknown) {
      Logger.log("Failed to fetch suggestions: ");
      if (typeof err === "string") {
        Logger.log(err);
      } else if (err instanceof Error) {
        Logger.log(err.message);
      }
    }
    return Promise.reject(new Error("Failed to retrieve suggestions"));
  }
}