import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import { useDispatch, useSelector } from "react-redux";
import {
  resetCurrentRequest,
  updateCurrentRequest,
  updateCurrentRequestMethod,
  updateCurrentRequestUrl,
  updateCurrentResponse,
  updateIsProcess,
} from "../redux/currentStateSlice";
import { useEffect } from "react";
import {
  StepStatus,
  Steps,
  updateStepsArray,
} from "../redux/commonStoargeSlice";

export default function HorizontalNonLinearStepper() {
  const dispatch = useDispatch();

  useEffect(() => {
    const stepsString = localStorage.getItem("steps");
    if (stepsString) {
      updateStepsArray(JSON.parse(stepsString));
    }
  });

  const stepsArray: Steps[] = useSelector(
    (state: any) => state.commonStoarge.stepsArray
  );

  const [activeStep, setActiveStep] = React.useState(-1);

  const handleStep = (step: number) => () => {
    setActiveStep(step);

    switch (step) {
      case 0: {
        dispatch(resetCurrentRequest());
        dispatch(updateIsProcess(true));

        const medicationRequestString =
          localStorage.getItem("medicationRequest");
        const medicationRequest = medicationRequestString
          ? JSON.parse(medicationRequestString)
          : {};
        dispatch(updateCurrentRequest(medicationRequest));

        const medicationResponseString =
          localStorage.getItem("medicationResponse");
        const medicationResponse = medicationResponseString
          ? JSON.parse(medicationResponseString)
          : {};
        dispatch(updateCurrentResponse(medicationResponse));

        dispatch(
          updateCurrentRequestUrl(localStorage.getItem("medicationRequestUrl"))
        );

        dispatch(
          updateCurrentRequestMethod(
            localStorage.getItem("medicationRequestMethod")
          )
        );
        break;
      }
      case 1: {
        dispatch(resetCurrentRequest());

        const cdsRequestString = localStorage.getItem("cdsRequest");
        const cdsRequest = cdsRequestString ? JSON.parse(cdsRequestString) : {};
        dispatch(updateCurrentRequest(cdsRequest));

        const cdsResponseString = localStorage.getItem("cdsResponse");
        const cdsResponse = cdsResponseString
          ? JSON.parse(cdsResponseString)
          : {};
        dispatch(updateCurrentResponse(cdsResponse));

        dispatch(
          updateCurrentRequestUrl(localStorage.getItem("cdsRequestUrl"))
        );
        dispatch(
          updateCurrentRequestMethod(localStorage.getItem("cdsRequestMethod"))
        );
        dispatch(updateCurrentRequestMethod(localStorage.getItem("cdsHook")));
        break;
      }
      case 2: {
        dispatch(resetCurrentRequest());
        break;
      }
      case 3: {
        dispatch(resetCurrentRequest());
        break;
      }
      case 4: {
        dispatch(resetCurrentRequest());

        const claimRequestString = localStorage.getItem("claimRequest");
        const claimRequest = claimRequestString
          ? JSON.parse(claimRequestString)
          : {};
        dispatch(updateCurrentRequest(claimRequest));

        const claimResponseString = localStorage.getItem("claimResponse");
        const claimResponse = claimResponseString
          ? JSON.parse(claimResponseString)
          : {};
        dispatch(updateCurrentResponse(claimResponse));

        dispatch(
          updateCurrentRequestUrl(localStorage.getItem("claimRequestUrl"))
        );
        dispatch(
          updateCurrentRequestMethod(localStorage.getItem("claimRequestMethod"))
        );
        break;
      }
      default: {
        break;
      }
    }
  };

  const [currentStep, setCurrentStep] = React.useState(-1);
  const globalActiveStep = useSelector(
    (state: any) => state.commonStoarge.activeStep
  );

  useEffect(() => {
    console.log(globalActiveStep);
    setCurrentStep(globalActiveStep);
  }, [globalActiveStep]);

  return (
    <Box
      sx={{
        marginBottom: "40px",
        paddingLeft: "10px",
        paddingRight: "10px",
        borderColor: "#000000",
      }}
    >
      <Stepper alternativeLabel nonLinear activeStep={currentStep}>
        {stepsArray.map((step, index) => (
          <Step key={step.name} completed={step.status == StepStatus.COMPLETED}>
            <StepButton
              disabled={step.status == StepStatus.NOT_STARTED}
              onClick={handleStep(index)}
            >
              {step.name}
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
