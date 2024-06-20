import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import ReusableModal from '../../../reusables/ReusableModal';
import NeonPOS from '../../../../assets/NeonPOS.png';
import { dispatchnewalert } from '../../../helpers/utils/alertdispatching';
import { SET_SETTINGS } from '../../../redux/types/types';
import Options from '../../../reusables/components/login/Options';
import BGLayout from '../../../reusables/BGLayout';
import Button from '../../../reusables/components/button/Button';
import Paragraph from '../../../reusables/components/typography/Paragraph';
import Header from '../../../reusables/components/typography/Header';
import { SetupSchema } from '../../../lib/schema/AuthSchema';
import { DataService } from '../../../helpers/http/dataService';
import SERVICE from '../../../lib/endpoints/Service';
import Input from '../../../reusables/components/input/Input';

type SetupData = z.infer<typeof SetupSchema>;

function Formtab() {
  const [isShuttingdown, setisShuttingdown] = useState<boolean>(false);
  const [hideBackground, setHideBackground] = useState<boolean>(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid }
  } = useForm<SetupData>({
    resolver: zodResolver(SetupSchema)
  });

  const verifyCredentials = async (data: SetupData) => {
    try {
      const response = await DataService.post(SERVICE.SETUP_DEVICE, data, 'NEONSERVICE');
      const { message } = response.data || {};

      dispatchnewalert(dispatch, 'success', message);
      localStorage.setItem('settings', JSON.stringify(data));
      dispatch({
        type: SET_SETTINGS,
        payload: {
          settings: data
        }
      });
      window.ipcRenderer.send('setup-type-reload', data.setup);
    } catch (err) {
      console.log(err);
      dispatchnewalert(dispatch, 'error', 'Device not match');
    }
  };

  const cancelSetup = () => {
    setisShuttingdown(true);
    setTimeout(() => {
      window.ipcRenderer.send('execute-command', 'systemctl poweroff');
    }, 5000);
  };

  return (
    <BGLayout className="w-full h-full absolute flex items-center">
      <Options isSetup setHideBackground={setHideBackground} />
      {!hideBackground && (
        <ReusableModal
          shaded={false}
          padded={false}
          children={
            <motion.div
              initial={{
                maxHeight: '0px'
              }}
              animate={{
                maxHeight: '720px'
              }}
              transition={{
                delay: 1,
                duration: 1
              }}
              className="border-[1px] bg-white w-[95%] h-[95%] max-w-[700px] shadow-md rounded-[10px] overflow-y-auto"
            >
              <div className="w-full h-full p-[25px] flex flex-col gap-[10px]">
                <div className="w-full flex flex-row">
                  <img src={NeonPOS} className="h-[60px]" alt="NEON POS ALT SRC" />
                </div>
                <div className="w-full flex flex-col justify-center items-center">
                  <Header type="h3" className="font-semibold ">
                    Welcome to Neon POS
                  </Header>
                  <Paragraph fontSize="xs">Powered by Neon Service</Paragraph>
                </div>
                <div className="w-full flex flex-col pt-[20px] pl-[20px] pr-[20px]">
                  <Paragraph fontSize="sm" className=" text-justify">
                    Introducing Neon POS, the innovative Point-of-Sales system powered by cutting-edge software, Neon
                    Service. Seamlessly integrating state-of-the-art solutions, Neon POS offers streamlined transactions
                    and instant insights, transforming businesses.
                  </Paragraph>
                </div>
                <div className="w-full flex flex-col pt-[10px] pl-[20px] pr-[20px] gap-[20px]">
                  <span className="text-[14px] font-Inter font-semibold">Enter setup details</span>
                  <div className="flex flex-col w-full pl-[20px] pr-[20px] gap-[10px]">
                    <form onSubmit={handleSubmit(verifyCredentials)}>
                      <div className="flex flex-col w-full gap-[5px]">
                        <span className="text-[12px] font-Inter font-semibold">Neon Service User ID</span>
                        <Input
                          {...register('userID')}
                          placeholder="eg: USR_00000_0000000000"
                          className="font-Inter bg-transparent border-[1px] h-[35px] pl-[10px] pr-[10px] outline-none text-[12px] w-full rounded-[4px]"
                        />
                      </div>
                      <div className="flex flex-col w-full gap-[5px]">
                        <span className="text-[12px] font-Inter font-semibold">Neon Service Device ID</span>
                        <Input
                          {...register('deviceID')}
                          placeholder="eg: USR_00000_0000000000"
                          className="font-Inter bg-transparent border-[1px] h-[35px] pl-[10px] pr-[10px] outline-none text-[12px] w-full rounded-[4px]"
                        />
                      </div>
                      <div className="flex flex-col w-full gap-[5px]">
                        <span className="text-[12px] font-Inter font-semibold">Connection Token</span>
                        <Input
                          {...register('connectionToken')}
                          placeholder="Input connection token of this device provided in Neon Remote"
                          className="font-Inter bg-transparent border-[1px] h-[35px] pl-[10px] pr-[10px] outline-none text-[12px] w-full rounded-[4px]"
                        />
                      </div>
                      <div className="flex flex-col w-full gap-[5px]">
                        <span className="text-[12px] font-Inter font-semibold">Setup Type</span>
                        <select
                          {...register('posType')}
                          className="font-Inter bg-transparent border-[1px] h-[35px] pl-[10px] pr-[10px] outline-none text-[12px] w-full rounded-[4px]"
                        >
                          <option defaultChecked value="POS">
                            POS
                          </option>
                          <option value="Portable">Portable</option>
                        </select>
                      </div>
                      <div className="flex flex-col w-full gap-[5px]">
                        <span className="text-[12px] font-Inter font-semibold">POS Type</span>
                        <select
                          {...register('setup')}
                          className="font-Inter bg-transparent border-[1px] h-[35px] pl-[10px] pr-[10px] outline-none text-[12px] w-full rounded-[4px]"
                        >
                          <option defaultChecked value="">
                            -- Select a POS Type --
                          </option>
                          <option value="fast_food">Fast Food</option>
                          <option value="restaurant">Restaurant</option>
                          <option value="convenience_store">Convenience Store</option>
                          <option value="market">Market</option>
                          <option value="retail">Retail</option>
                        </select>
                      </div>
                      <div className="flex flex-flex w-full gap-[5px] pt-[10px] pb-[10px]">
                        <Button
                          type="submit"
                          disabled={isSubmitting || !isValid}
                          loading={isSubmitting}
                          className="h-[32px]   text-[12px] bg-accent-tertiary   text-white"
                        >
                          {isSubmitting ? 'Verifying Credentials' : 'Verify and Confirm'}
                        </Button>

                        <Button
                          type="submit"
                          disabled={isShuttingdown}
                          onClick={cancelSetup}
                          loading={isShuttingdown}
                          className="h-[32px]   bg-red-500  text-[12px]  text-white"
                        >
                          {isShuttingdown ? 'Shutting down' : 'Cancel Setup'}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          }
        />
      )}
    </BGLayout>
  );
}

export default Formtab;
