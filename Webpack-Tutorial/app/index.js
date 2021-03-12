import { run } from "./app/app.js"
import { ComponentService } from "./app/component.service.js"
import { AlertService } from "./app/alert.service.js"

const alertService = new AlertService();
const componentService = new ComponentService();
run(alertService, componentService);
