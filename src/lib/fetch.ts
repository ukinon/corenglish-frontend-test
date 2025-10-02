import { PaginatedResponse } from "@/types";

interface FetchOptions extends Omit<RequestInit, "headers" | "body"> {
  onProgress?: (progress: number) => void;
  headers?: Record<string, string>;
  body?: XMLHttpRequestBodyInit | null;
  query?: string;
}

export async function $fetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<{ data: T | PaginatedResponse<T> | null; error: Error | null }> {
  const defaultHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  if (options.body instanceof FormData) {
    delete options.headers?.["Content-Type"];
    options.headers = {
      ...options.headers,
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    };
  }

  if (options.body instanceof FormData && options.onProgress) {
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && options.onProgress) {
          const progress = (event.loaded / event.total) * 100;
          options.onProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve({ data: JSON.parse(xhr.response), error: null });
          } catch {
            resolve({ data: xhr.response as T, error: null });
          }
        } else {
          reject({
            data: null,
            error: new Error(`HTTP error! status: ${xhr.status}`),
          });
        }
      });

      xhr.addEventListener("error", () => {
        reject({ data: null, error: new Error("Network error") });
      });

      xhr.open(
        options.method || "GET",
        `${process.env.NEXT_PUBLIC_API_URL}${url}`
      );

      Object.entries({
        ...defaultHeaders,
        ...options.headers,
      }).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value as string);
      });

      xhr.send(options.body);
    });
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}${
    options.query ? `?${options.query}` : ""
  }`;

  const response = await fetch(apiUrl, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    return {
      data: null,
      error: new Error(
        error?.message || `HTTP error! status: ${response.status}`
      ),
    };
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const data = await response.json();
    return { data: data || data, error: null };
  }

  if (contentType?.includes("text/plain; charset=utf-8")) {
    const data = response.body;
    return { data: data as T, error: null };
  }

  return { data: response as T, error: null };
}
