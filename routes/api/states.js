const express = require("express");
const router = express();
const stateController = require("../../controllers/statesController");
const verifyState = require('../../middleware/verifyState');

// Import the logger middleware for debugging
const logger = require('../../middleware/logEvents');


router.route("/")
  .get(stateController.getAllStates, logger.logEvents, logger.logger);
router.route("/:state")
  .get(verifyState,stateController.getState, logger.logEvents, logger.logger);
router.route("/:state/funfact")
  .get(verifyState,stateController.getFunFact, logger.logEvents, logger.logger)
  .post(verifyState,stateController.createFunFact, logger.logEvents, logger.logger)
  .patch(verifyState,stateController.updateFunFact, logger.logEvents, logger.logger)
  .delete(verifyState,stateController.deleteFunFact, logger.logEvents, logger.logger);
router.route("/:state/capital")
  .get(verifyState,stateController.getCapital, logger.logEvents, logger.logger);
router.route("/:state/nickname")
  .get(verifyState,stateController.getNickname, logger.logEvents, logger.logger);
router.route("/:state/population")
  .get(verifyState,stateController.getPopulation, logger.logEvents, logger.logger);
router.route("/:state/admission")
  .get(verifyState,stateController.getAdmission, logger.logEvents, logger.logger);

module.exports = router;