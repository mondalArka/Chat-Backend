import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";

export class HTTPException implements ExceptionFilter {

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status: number = 500;
        let message: string | null = "Internal Server Error";
        let validationMessages: string[] | null = null;
        switch (exception instanceof HttpException) {
            case true: {
                status = (exception as HttpException).getStatus();
                message = (exception as HttpException).message || null;

                const exceptionResponse = (exception as HttpException).getResponse() as any;
                if (Array.isArray(exceptionResponse.message)) {
                    validationMessages = exceptionResponse.message;
                    message = exceptionResponse.error || message;
                }
                break;
            }
            case false: {
                console.error(exception);
                status = HttpStatus.INTERNAL_SERVER_ERROR;
                message = "Internal Server Error";
                break;
            }
        }

        response.status(status).json({
            statusCode: status,
            success: false,
            error: validationMessages || message,
            path: request.url,
        });

    }
}