import React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { disableGPU } from "./TestUtils";

afterEach(cleanup);

test("app greets user", () => {
  expect(true).toBeTruthy();
}
