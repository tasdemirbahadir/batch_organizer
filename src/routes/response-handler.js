const handleResponse = (routeHandler) => async (request, response) => {
  try {
    const routeHandlerReturn = await routeHandler(request, response);
    response.status(routeHandlerReturn.status);
    response.json(routeHandlerReturn.payload);
  } catch (error) {
    console.error("Error occured: ", error);
    response.status(500);
    response.json({ errors: "Unexpected error occurred" });
  }
};

module.exports = { handleResponse };
