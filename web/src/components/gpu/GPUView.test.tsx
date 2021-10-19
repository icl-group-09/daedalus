import React from "react";
import GPUView from "./GPUView";
import { init } from "./ThreeHandler";
import renderer from "react-test-renderer";
import Enzyme, { mount, ReactWrapper } from "enzyme";

describe("GPUView", () => {
  let wrapper = mount(<GPUView height={80} width={80} />);

  it("Renders", () => {
    const canvas = wrapper.find("canvas");
    expect(canvas.exists()).toBe(true);
  });
});
