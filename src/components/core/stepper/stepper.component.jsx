import React, { Children, isValidElement, cloneElement } from 'react';
import BaseStepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from './use-window.hook';

const Stepper = ({ stepLabels, step = 0, children }) => {
    const [activeStep, setActiveStep] = React.useState(step);
    const size = useWindowSize();
    const { t } = useTranslation();

    const showVertical = size.width <= 760 ? true : false;

    const next = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const back = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const childrenWithProps = Children.map(children, child => {
        if (isValidElement(child)) {
            const totalSteps = stepLabels.length;
            return cloneElement(child, { next, back, activeStep, totalSteps });
        }
        return child;
    });

    return (
        <div>
            {showVertical ? (
                <div>
                    <BaseStepper activeStep={activeStep} orientation="vertical">
                        {stepLabels.map((label, index) => (
                            <Step key={label}>
                                <StepLabel>{t(label)}</StepLabel>
                                <StepContent>{childrenWithProps[activeStep]}</StepContent>
                            </Step>
                        ))}
                    </BaseStepper>
                </div>
            ) : (
                <div>
                    <BaseStepper activeStep={activeStep} alternativeLabel>
                        {stepLabels.map(label => (
                            <Step key={label}>
                                <StepLabel>{t(label)}</StepLabel>
                            </Step>
                        ))}
                    </BaseStepper>
                    <div>{childrenWithProps[activeStep]}</div>
                </div>
            )}
        </div>
    );
};

export default Stepper;
