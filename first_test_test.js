Feature("If my page works");

Scenario("test something", I => {
  I.amOnPage("/");
  I.see("MyReads");
  I.click("select");
  I.see("Currently Reading");
});
