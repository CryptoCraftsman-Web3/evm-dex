import { Grid, Typography, Paper, Button, Box } from '@mui/material'
import { useState } from 'react'
import FaqBox from './faq-box'
import { faqAnswers } from '@/lib/data/faq'

const Faq = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Grid container spacing={2} justifyContent={'center'}>
      <Grid item xs={12}>
        <Typography
          variant='h2'
          textAlign={'center'}
          mb={'60px'}
          fontSize={{ xs: '40px', md: '74px' }}
        >
          Got questions?
        </Typography>
      </Grid>
      {faqAnswers.map((faq, index) => (
        <Grid item xs={12} md={8} key={index}>
          <FaqBox title={faq.title} content={faq.content} />
        </Grid>
      ))}
    </Grid >
  )
}

export default Faq