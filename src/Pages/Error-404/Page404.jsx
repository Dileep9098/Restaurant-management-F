import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Page404() {
  const navigate = useNavigate();

  const handleBack = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <div className="auth-page-wrapper py-5 d-flex justify-content-center align-items-center min-vh-100">
        {/* auth-page content */}
        <div className="auth-page-content overflow-hidden p-0">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-7 col-lg-8">
                <div className="text-center">
                  <img
                    src="/assets/images/error400-cover.png"
                    alt="error img"
                    className="img-fluid"
                  />
                  <div className="mt-3">
                    <h3 className="text-uppercase">Sorry, Page not Found 😭</h3>
                    <p className="text-muted mb-4">
                      The page you are looking for not available!
                    </p>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleBack}
                    >
                      <i className="mdi mdi-home me-1" />
                      Back
                    </button>
                  </div>
                </div>
              </div>
              {/* end col */}
            </div>
            {/* end row */}
          </div>
          {/* end container */}
        </div>
        {/* end auth-page content */}
      </div>
    </>
  );
}