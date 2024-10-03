const multiply = require("../utils/multiply");
const get_chai = require("../utils/get_chai");

describe("testing multiply", () => {
  it("should give 5*9 is 45", async () => {
    const { expect } = await get_chai();
    expect(multiply(5, 9)).to.equal(45);
  });
  // it('should give 7*6 is 97', async () => {
  //   const {expect} = await get_chai();
  //   expect(multiply(7,6)).to.equal(97);
  // });
});