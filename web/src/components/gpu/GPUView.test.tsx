import React from "react";
import GPUView from "./GPUView";
import init from "./ThreeHandler";
import { mount } from "enzyme";

jest.mock("./ThreeHandler");

test("Expect init to be called", () => {
  let wrapper = mount(<GPUView height={80} width={80} initFunc={init} />);
  expect(init).toBeCalled();
});
