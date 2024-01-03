import { Fade, Modal, Paper, Box, IconButton, Stack, Typography, Divider, Grid, Button } from '@mui/material'
import React from 'react'
import { colors } from '@/theme/default-colors'
import Tag from '@/components/tag'

type TokenIdModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

const TokenIdModal = ({ isModalOpen, setIsModalOpen }: TokenIdModalProps) => {
  const [switchToken, setSwitchToken] = React.useState(0);

  return (
    <Modal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      closeAfterTransition
      keepMounted
    >
      <Fade in={isModalOpen}>
        <Paper
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '650px',
            maxWidth: '100%',
            maxHeight: '85%'
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: '16px',
              right: '16px',
            }}
            onClick={() => setIsModalOpen(false)}
          >
            <img src={'/icons/close.svg'} alt="close icon" />
          </IconButton>

          <Stack
            direction="row"
            gap="14px"
          >
            <Typography variant='subtitle3'>USDX - WXRP</Typography>
            <Tag color="darkGreen">Active</Tag>
          </Stack>
          <Divider sx={{ width: '100%' }} />
          <Stack direction="column" gap="36px">
            <Grid container spacing="20px">
              <Grid item xs={6}>
                <Typography variant='body1'>Liquidity</Typography>
                <Typography variant='subtitle2'>$404</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant='body1'>Unclaimed fees</Typography>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant='subtitle2'>$12.34</Typography>
                  <Button variant="widget" size="small">Collect</Button>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    p: '20px',
                    borderRadius: '12px',
                    backgroundColor: colors.tertiaryBG,
                    width: '100%',
                  }}
                >
                  <Stack gap="16px">
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant='body16Medium' color="white">USDT</Typography>
                      <Typography variant='body16Medium' color="white">2.3345</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant='body16Medium' color="white">USDT</Typography>
                      <Typography variant='body16Medium' color="white">2.3345</Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    p: '20px',
                    borderRadius: '12px',
                    backgroundColor: colors.tertiaryBG,
                    width: '100%',
                  }}
                >
                  <Stack gap="16px">
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant='body16Medium' color="white">USDT</Typography>
                      <Typography variant='body16Medium' color="white">2.3345</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant='body16Medium' color="white">USDT</Typography>
                      <Typography variant='body16Medium' color="white">2.3345</Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1" color="white">Price range</Typography>
              <Box
                sx={{
                  display: 'flex',
                  padding: '2px',
                  alignItems: 'flex-start',
                  borderRadius: '8px',
                  backgroundColor: colors.tertiaryBG
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    padding: '4px 12px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '6px',
                    gap: '10px',
                    backgroundColor: !switchToken ? colors.cta : colors.tertiaryBG,
                    color: !switchToken ? 'white' : colors.textGrey,
                    cursor: 'pointer'
                  }}
                  onClick={() => setSwitchToken(0)}
                >
                  DAI
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    padding: '4px 12px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '6px',
                    gap: '10px',
                    backgroundColor: switchToken ? colors.cta : colors.tertiaryBG,
                    color: switchToken ? 'white' : colors.textGrey,
                    cursor: 'pointer'
                  }}
                  onClick={() => setSwitchToken(1)}
                >
                  WXRP
                </Box>
              </Box>
            </Stack>
            <Grid container spacing="20px">
              <Grid item xs={6}>
                <Box
                  sx={{
                    p: '20px',
                    borderRadius: '12px',
                    backgroundColor: colors.tertiaryBG,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="footnote">Low price</Typography>
                  <Typography variant="numbers">0.99900055</Typography>
                  <Typography variant="footnote">3% select</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    p: '20px',
                    borderRadius: '12px',
                    backgroundColor: colors.tertiaryBG,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="footnote">High price</Typography>
                  <Typography variant="numbers">0.99900055</Typography>
                  <Typography variant="footnote">3% select</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: '20px',
                    borderRadius: '12px',
                    backgroundColor: colors.tertiaryBG,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="footnote">Current price</Typography>
                  <Typography variant="numbers">0.99900055</Typography>
                  <Typography variant="footnote">3% select</Typography>
                </Box>
              </Grid>
            </Grid>
            <Button variant='widget'>Delete</Button>
          </Stack>
        </Paper>
      </Fade>
    </Modal>
  )
}

export default TokenIdModal