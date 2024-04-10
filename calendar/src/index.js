import { StrictMode } from "react";
import ReactDOM from "react-dom";

import ReactBigCalendar from "./ReactBigCalendar";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <ReactBigCalendar />
  </StrictMode>,
  rootElement
);
