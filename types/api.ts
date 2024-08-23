/**
 * Represents a successful response from the API.
 * @template T The type of data returned by the API.
 */
export interface SuccessResponse<T> {
  /**
   * A boolean indicating whether the response was successful.
   */
  ok: true;
  /**
   * The data returned by the API.
   */
  data: T;
}

/**
 * Represents an unsuccessful response from the API.
 */
export interface ErrorResponse {
  /**
   * A boolean indicating whether the response was successful.
   */
  ok: false;
  /**
   * An error message returned by the API.
   */
  error: string;
}

/**
 * Represents either a successful or unsuccessful response from the API.
 * @template T The type of data returned by the API.
 */
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Represents options for making a fetch request to the API.
 */
export interface FetchOptions extends RequestInit {}
