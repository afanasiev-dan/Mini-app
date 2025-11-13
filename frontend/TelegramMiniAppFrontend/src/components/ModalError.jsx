import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

export default function ModalError() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  window.showError = (msg) => {
    setMessage(msg);
    setShow(true);
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ошибка</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <textarea className="form-control" value={message} rows={5} readOnly />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Закрыть
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            navigator.clipboard.writeText(message);
            alert("Скопировано!");
          }}
        >
          Копировать
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
