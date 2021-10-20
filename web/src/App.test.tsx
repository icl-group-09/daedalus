// __tests__/fetch.test.js
import { render, cleanup, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-canvas-mock";
import App from "./App";
import { disableGPU } from "./TestUtils";

afterEach(cleanup);

test("app greets user", async () => {
  const {} = render(disableGPU(<App />));
  const welcome = screen.getByRole("heading", {
    name: /Welcome to Daedalus!/i,
  });

  expect(welcome).toBeInTheDocument();
});
