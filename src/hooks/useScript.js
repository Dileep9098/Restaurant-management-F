// import { useEffect } from "react";

// export default function useScript(src) {
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = src;
//     script.async = false;
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, [src]);
// }



// import { useEffect } from "react";

// export default function useScript(src) {
//   useEffect(() => {
//     if (!src) return;

//     // already loaded?
//     const existingScript = document.querySelector(`script[src="${src}"]`);
//     if (existingScript) return;

//     const script = document.createElement("script");
//     script.src = src;
//     script.async = false;
//     script.defer = true;

//     document.body.appendChild(script);

//     return () => {
//       // ❌ script remove mat karo (VERY IMPORTANT)
//     };
//   }, [src]);
// }



// import { useEffect } from "react";

// export default function useScript(src) {
//   useEffect(() => {
//     if (!src) return;

//     // check if already loaded
//     const existingScript = document.querySelector(`script[src="${src}"]`);
//     if (existingScript) return;

//     const script = document.createElement("script");
//     script.src = src;
//     script.async = false;
//     script.defer = true;

//     document.body.appendChild(script);

//     // never remove script to prevent layout break
//   }, [src]);
// }



import { useEffect } from "react";

export default function useScript(src) {
  useEffect(() => {
    if (!src) return;

    if (document.querySelector(`script[src="${src}"]`)) return;

    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.defer = true;

    document.body.appendChild(script);
  }, [src]);
}
