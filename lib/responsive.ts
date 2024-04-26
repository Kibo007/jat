"use server";

import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

export const isMobileDevice = () => {
  if (typeof process === "undefined") {
    throw new Error(
      "[Server method] you are importing a server-only module outside of server"
    );
  }

  const { get } = headers();
  const ua = get("user-agent");

  const device = new UAParser(ua || "").getDevice();

  return device.type === "mobile";
};

// This component is only for server components here is how to use it:

// import { isMobileDevice } from "@/libs/responsive"; // import the function

// export default function Component() {
//   const mobile = isMobileDevice(); // execute the function

//   return (
//     <Header
//       isMobile={mobile} // pass it as props to the client component
//     />
//   );
// }
