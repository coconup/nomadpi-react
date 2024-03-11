import { useState, useEffect } from 'react';

import {
  usePostButterflyIntentMutation,
  usePostButterflyCommandConfirmationMutation,
  usePostButterflyServiceFunctionMutation,
} from '../../apis/nomadpi/nomadpi-app-api';

export default function ButterflyProvider({ prompt, command, commandConfirmations, onProcessing=()=>{}, onError, onResponse }) {
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
    const butterfly = async () => {
      console.log('calling butterfly', prompt || command || commandConfirmations)
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
      }
    };

    if(prompt || command || commandConfirmations) {
      butterfly();
    };
  }, [prompt, command, commandConfirmations]);
};