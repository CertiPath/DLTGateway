pragma solidity >=0.4.0 <0.6.0;
import "remix_tests.sol"; // this import is automatically injected by Remix.
import "Measurement.sol";

contract MeasurementTests {

  function addLocationTest() public {
      Measurement measurement = new Measurement();
      uint64 epoch_May_21_2019_02_21_pm = 1558466440;
      string livingRoom = "living room";
      measurement.setLocation(livingRoom, epoch_May_21_2019_02_21_pm, 70);
      Assert.equal(epoch_May_21_2019_02_21_pm, measurement.getUpdatedLocationName(), "updated location name mismatch");
  }

}
