import React from 'react'
import { Modal, Paper, Fade } from '@mui/material'

type ModalContainerProps = {
  children: React.ReactNode;
  open: boolean;
  handleClose: (open: boolean) => void;
}

const ModalContainer = ({ children, open, handleClose }: ModalContainerProps) => {
  return (
    < Modal
      open={open}
      onClose={() => {
        handleClose(false)
      }}
      closeAfterTransition
      keepMounted
    >
      <Fade in={open}>
        <Paper
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '650px',
            maxWidth: '100%',
            maxHeight: '85%',
          }}
        >
          {children}
        </Paper>
      </Fade>
    </Modal>
  )
}

export default ModalContainer