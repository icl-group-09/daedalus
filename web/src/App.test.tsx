import React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { disableGPU } from "./TestUtils";

afterEach(cleanup);

test("app greets user", () => {
  // const {} = render(disableGPU(<App />));
  // const welcome = screen.getByRole("heading", {
  //   name: /Welcome to Daedalus!/i,
  // });

  // expect(welcome).toBeInTheDocument();
});
