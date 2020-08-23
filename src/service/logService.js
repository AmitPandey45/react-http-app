import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/apm";

function init() {
  Sentry.init({
    dsn:
      "https://06f79e5d25d84c2191d8e9b60fee7386@o437687.ingest.sentry.io/5400571",
    release: "1-0-0",
    environment: "develoment-test",
    integrations: [new Integrations.Tracing()],
    tracesSampleRate: 1.0,
  });
}

function log(error) {
  Sentry.captureException(error);
}

export default {
  init,
  log,
};
