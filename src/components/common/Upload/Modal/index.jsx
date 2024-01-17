'use client'
import React from 'react'
import ReactDOM from 'react-dom'

const Modal = ({ isOpen = true, onClose, title, children }) =>
  isOpen
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9999,
            }}
          >
            <div
              style={{
                width: 600,
                minHeight: 600,
                backgroundColor: 'white',
                borderRadius: 16,
                flexDirection: 'column',
                display: 'flex',
              }}
              aria-modal
              aria-hidden
              tabIndex={-1}
              role='dialog'
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingLeft: 16,
                }}
              >
                <h1>{title}</h1>
                <button
                  type='button'
                  style={{
                    fontSize: 24,
                    width: 45,
                    height: 45,
                  }}
                  data-dismiss='modal'
                  aria-label='Close'
                  onClick={onClose}
                >
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  position: 'relative',
                  flex: 1,
                  flexDirection: 'column',
                  margin: 16,
                }}
              >
                {children}
              </div>
            </div>
          </div>
        </React.Fragment>,
        document.body
      )
    : null

export default Modal
