/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/typography/Header';
import Paragraph from '../components/typography/Paragraph';

function WelcomeBanner() {
  return (
    <div className="w-full bg-shade flex flex-1 flex-col items-center justify-center gap-[20px]">
      <motion.div
        initial={{
          height: '0px'
        }}
        animate={{
          height: '100%'
        }}
        transition={{
          delay: 1,
          duration: 2,
          ease: 'circInOut'
        }}
        className="overflow-y-hidden flex flex-col items-center justify-center gap-[20px]"
      >
        <Header type="h4" className="font-semibold">
          Welcome to Neon POS
        </Header>
        <Paragraph fontSize="sm" className="w-full max-w-[700px]">
          We're thrilled to introduce you to Neon POS, an innovative Point-of-Sales system driven by the advanced Neon
          Service software. Our state-of-the-art solutions ensure seamless transactions and instant insights,
          transforming the way you do business.
        </Paragraph>

        <Paragraph fontSize="sm" className="w-full max-w-[700px]">
          Prepare for a new era of efficiency and control in your operations. Let's get started!
        </Paragraph>
      </motion.div>
    </div>
  );
}

export default WelcomeBanner;
