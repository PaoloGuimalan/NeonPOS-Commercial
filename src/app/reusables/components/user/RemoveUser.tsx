import React, { useState } from 'react';
import Button from '../button/Button';
import ReusableModal from '../../ReusableModal';
import { motion } from 'framer-motion';
import Header from '../typography/Header';
import Paragraph from '../typography/Paragraph';

type Props = {
  onConfirm: () => void;
  disabled: boolean;
};

const RemoveUser = ({ onConfirm, disabled }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const modalHandler = () => setIsOpen((prev) => !prev);

  const confirmRemovingUser = () => {
    onConfirm();
    modalHandler();
  };

  return (
    <>
      <Button disabled={disabled} onClick={modalHandler} variant="destructive">
        {disabled ? 'Removing...' : 'Remove'}
      </Button>
      {isOpen && (
        <ReusableModal
          shaded
          padded={false}
          children={
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white w-[95%] h-fit max-w-[450px] py-6 rounded-[7px] absolute z-40 p-[20px] flex flex-col"
            >
              <div>
                <Header type="h5" className="font-bold mb-3 text-gray-900">
                  Are you absolutely sure?
                </Header>
                <Paragraph fontSize={'md'}>
                  This action cannot be undone. This will permanently delete this user and remove data from our servers.
                </Paragraph>
                <div className="mt-5 flex justify-end gap-2 items-center">
                  <Button onClick={modalHandler} disabled={disabled} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={confirmRemovingUser} disabled={disabled} loading={disabled} variant="destructive">
                    Confirm
                  </Button>
                </div>
              </div>
            </motion.div>
          }
        />
      )}
    </>
  );
};

export default RemoveUser;
