//success response method
export class ResponseService {
  successResponse(data: any, message: string) {
    return {
      data,
      message,
    };
  }
  errorResponse(message: string, errors: any) {
    return {
      message,
      errors,
    };
  }
}
