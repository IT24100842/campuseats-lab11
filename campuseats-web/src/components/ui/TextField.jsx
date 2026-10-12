import { forwardRef } from "react";

// ── Slides 18 & 27: reusable form field ──────────────────────────
// forwardRef lets React Hook Form's register() attach directly to the
// native <input> – that is what makes RHF "uncontrolled" and fast.
const TextField = forwardRef(function TextField(
  { label, error, ...rest },
  ref
) {
  return (
    <div className="field">
      <label>{label}</label>
      <input ref={ref} {...rest} />
      {error && <p className="error">{error}</p>}
    </div>
  );
});

export default TextField;
