import { createProxyMiddleware } from "http-proxy-middleware";

module.exports = function (app) {
  app.use(
    "/predict", //this is your api
    createProxyMiddleware({
      target: "http://127.0.0.1:8000/predict", //this is your whole endpoint link
      changeOrigin: true,
    })
  );

  app.use(
    "/predict", //this is your api
    createProxyMiddleware({
      target: "http://127.0.0.1:8000/predict", //this is your whole endpoint link
      changeOrigin: true,
    })
  );
};
