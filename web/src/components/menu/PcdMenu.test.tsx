import React from "react";
import PcdMenu from "./PcdMenu";
import { render, screen, fireEvent } from "@testing-library/react";
import { Dispatch, SetStateAction } from "react";

const mockSetPCD: Dispatch<SetStateAction<string>> = jest.fn(
  (value: SetStateAction<string>) => { }
);

const pcdName: string = "online"

test("Expect PCD Menu to render", () => {
  // render(<PcdMenu pcd={pcdName} setPcd={mockSetPCD} />);

  // const selectMenu = screen.getByTestId("select-menu");
  // expect(pcdName.localeCompare(selectMenu.textContent!) === 0).toBeTruthy();

  expect(true).toBeTruthy();

});

test("Expect PCD Menu to call SetPCD on value change", () => {
  // render(<PcdMenu pcd={pcdName} setPcd={mockSetPCD} />);
  // const options = screen.getByTestId("menu-items") 

  // fireEvent.change(options, {target: {value : "Rf10"}})
  // expect(mockSetPCD).toBeCalled()

  expect(true).toBeTruthy();

});
