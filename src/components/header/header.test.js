import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";

it('check header is loaded ?',()=>{
    render(<Header />)

    expect(screen.getByText("Home"))
})
