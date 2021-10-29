import React from "react";
import PcdMenu from "./PcdMenu";
import { render, screen } from "@testing-library/react";
import { Dispatch, SetStateAction } from "react";

test("Expect inital GPUView to call renderPCD on mount", () => {
  const mockSetPCD: Dispatch<SetStateAction<string>> = jest.fn(
    (value: SetStateAction<string>) => {}
  );

  render(<PcdMenu pcd="online" setPcd={mockSetPCD} />);

  const label = screen.getByTestId("select-label");
  expect(label.textContent).toBe("PCD");
});
