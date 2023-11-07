const router = require("express-promise-router")();
const DestinationController = require("../controllers/destination");


router.route('/')
    .get(DestinationController.getAllDestination)
    .post(DestinationController.addDestination)
    
router.route('/:destinationID')
    .get(DestinationController.getDestinationByID)
    .patch(DestinationController.updateDestination)
    .delete(DestinationController.deleteDestination)

module.exports = router;