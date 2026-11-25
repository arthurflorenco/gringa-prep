import { exercises as jsEventLoop } from "./exercises/js-event-loop";
import { exercises as jsClosures } from "./exercises/js-closures-scope";
import { exercises as jsData } from "./exercises/js-data-structures";
import { exercises as career } from "./exercises/career";
import { exercises as frontendCore } from "./exercises/frontend-core";
import { exercises as backendSecurity } from "./exercises/backend-security";
import { terms } from "./glossary/terms";
import { topics } from "./topics";

/** Para adicionar um ficheiro novo de exercícios, importe-o aqui. */
export const rawContent = {
  topics,
  exercises: [...jsEventLoop, ...jsClosures, ...jsData, ...career, ...frontendCore, ...backendSecurity],
  terms,
};
