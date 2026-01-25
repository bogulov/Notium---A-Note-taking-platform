export class ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;

  constructor({
    data,
    message,
    success = true,
  }: {
    data?: T;
    message?: string;
    success?: boolean;
  }) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}
