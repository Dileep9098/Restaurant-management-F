import React from 'react'

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <p className="fs-11 text-muted fw-medium text-uppercase mb-0 copyright">
          <span>Copyright ©</span>
        </p>
        <p>
          <span>
            By:{" "}
            <a target="_blank" href="https://myrestaurent.com">
              Restaurent 
            </a>
          </span>{" "}
          •{" "}
          <span>
            Distributed by:{" "}
            <a target="_blank" href="https://myrestaurent.com">
              My Restaurenet
            </a>
          </span>
        </p>
        <div className="d-flex align-items-center gap-4">
          <a
            href="javascript:void(0);"
            className="fs-11 fw-semibold text-uppercase"
          >
            Help
          </a>
          <a
            href="javascript:void(0);"
            className="fs-11 fw-semibold text-uppercase"
          >
            Terms
          </a>
          <a
            href="javascript:void(0);"
            className="fs-11 fw-semibold text-uppercase"
          >
            Privacy
          </a>
        </div>
      </footer>
    </>
  )
}
