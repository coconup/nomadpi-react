import { useState, useEffect } from 'react';

import {
  usePostButterflyIntentMutation,
  usePostButterflyCommandConfirmationMutation,
  usePostButterflyServiceFunctionMutation,
} from '../../apis/van-pi/vanpi-app-api';

export default function ButterflyProvider({ prompt, command, commandConfirmations, onProcessing=()=>{}, onError, onResponse }) {
  const baseUrl = `${process.env.REACT_APP_API_BASE_URL}`;

  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const [
    postButterflyIntentTrigger, 
    postButterflyIntentState
  ] = usePostButterflyIntentMutation();

  const [
    postButterflyCommandConfirmationTrigger, 
    postButterflyCommandConfirmationState
  ] = usePostButterflyCommandConfirmationMutation();

  const [
    postButterflyServiceFunctionTrigger, 
    postButterflyServiceFunctionState
  ] = usePostButterflyServiceFunctionMutation();

  useEffect(() => {
    if (processing && !processed) {
      const timeoutId = setTimeout(onError, 10000);
      console.log('setting butterfly timeout', timeoutId);

      return () => {
        console.log('clearing butterfly timeout')
        clearTimeout(timeoutId);
      };
    }
  }, [processing, processed]);

  useEffect(() => {
    const butterfly = async () => {
      console.log('calling butterfly', prompt || command || commandConfirmations)
      setProcessing(true);
      setProcessed(false);
      onProcessing();

      let response;
      let error;

      if(prompt) {
        response = await postButterflyIntentTrigger({ prompt });
        error = postButterflyIntentState.error;
      } else if (command) {
        const {
          original_prompt,
          service_id,
          function_name,
          function_arguments: body
        } = command;

        response = await postButterflyServiceFunctionTrigger({ service_id, function_name, original_prompt, ...body });
        error = postButterflyCommandConfirmationState.error;
      } else if(commandConfirmations) {
        response = await postButterflyCommandConfirmationTrigger({ commands: commandConfirmations });
        error = postButterflyServiceFunctionState.error;
      }

      if(error || response.error) {
        console.error('Error calling Butterfly API:', error || response.error);
        onError();
      } else {
        onResponse(response);
        setProcessed(true);
      }
    };

    if(prompt || command || commandConfirmations) {
      butterfly();
    };
  }, [prompt, command, commandConfirmations]);
};