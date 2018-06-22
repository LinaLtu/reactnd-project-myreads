Feature("If my page works");

Scenario("test something", I => {
  I.amOnPage("/");
  I.wait(1000).see("Needful Things");
  I.waitForElement("option[value=currentlyReading]");
  I.see("Currently Reading");
  //I.click(" option[value=currentlyReading]");
  //I.see("Currently Reading");
});
