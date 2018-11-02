module.exports = function wrapController(controller) {
  return async function(ctx) {
    try {
      ctx.body = { success: true, response: await controller(ctx) };
    } catch (err) {
      ctx.status = 500;
      ctx.body = { success: true, error: 'unexpectedServerError' };
      console.error(err);
    }
  }
};
