export type ApiResponse<T> = {
    statusCode: number;
    success: boolean;
    error?: string | null;
    message: string | null;
    data?: T;
}