import { createContext, useContext } from "react";

// ── Slide 17: COMPOUND COMPONENT with shared implicit state ──────
// Usage:
//   <Modal open={open} onClose={close}>
//     <Modal.Header>Title</Modal.Header>
//     <Modal.Body>...</Modal.Body>
//     <Modal.Footer>...</Modal.Footer>
//   </Modal>
// The pieces share state through a PRIVATE context – the user of the
// component never wires them together manually. Same idea as HTML's
// <select> + <option>.
const ModalContext = createContext(null);

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <ModalContext.Provider value={{ onClose }}>
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
}

function Header({ children }) {
  return <div className="modal-header">{children}</div>;
}

function Body({ children }) {
  return <div className="modal-body">{children}</div>;
}

function Footer({ children }) {
  // Footer can read the shared context, e.g. to render a close button.
  useContext(ModalContext);
  return <div className="modal-footer">{children}</div>;
}

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;
