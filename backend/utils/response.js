// Standard API Response Helpers

const successResponse = (res, statusCode, data, message = 'Success') => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

const errorResponse = (res, statusCode, message, errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};

const paginatedResponse = (res, statusCode, data, pagination, message = 'Success') => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        pagination: {
            page: pagination.page,
            limit: pagination.limit,
            totalPages: pagination.totalPages,
            totalItems: pagination.totalItems,
            hasNextPage: pagination.hasNextPage,
            hasPrevPage: pagination.hasPrevPage
        }
    });
};

module.exports = {
    successResponse,
    errorResponse,
    paginatedResponse
};
