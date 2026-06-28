import { useState, useCallback } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

const TOUR_KEY = "rankboost_tour_completed";

const steps: Step[] = [
    {
        target: "body",
        placement: "center",
        title: "Welcome to RankBoost! 🚀",
        content: "Let's take a quick tour to help you get started. This will only take a minute.",
        disableBeacon: true,
    },
    {
        target: '[data-tour="rank-tracker"]',
        title: "Track Your Keywords",
        content: "Add your website's keywords here and we'll track their Google rankings daily.",
        disableBeacon: true,
    },
    {
        target: '[data-tour="analyze"]',
        title: "Analyze Your Website",
        content: "Run a full SEO audit on any URL to discover issues and opportunities.",
        disableBeacon: true,
    },
    {
        target: '[data-tour="dashboard"]',
        title: "Your Dashboard",
        content: "Monitor all your SEO metrics, ranking changes, and competitor insights in one place.",
        disableBeacon: true,
    },
    {
        target: '[data-tour="upgrade"]',
        title: "Go Pro for More Power 💪",
        content: "Unlock unlimited keywords, daily tracking, and advanced reports with Pro.",
        disableBeacon: true,
    },
];

function TourComponent({ run, onFinish }: { run: boolean; onFinish: () => void }) {
    const handleCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
        if (finishedStatuses.includes(status)) {
            localStorage.setItem(TOUR_KEY, "true");
            onFinish();
        }
    };

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            showSkipButton
            showProgress
            callback={handleCallback}
            styles={{
                options: {
                    zIndex: 10000,
                    arrowColor: "var(--card)",
                    backgroundColor: "var(--card)",
                    textColor: "var(--foreground)",
                    primaryColor: "hsl(var(--primary))",
                    overlayColor: "rgba(0, 0, 0, 0.6)",
                },
                tooltip: {
                    borderRadius: "16px",
                    padding: "20px",
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                },
                tooltipTitle: {
                    fontSize: "18px",
                    fontWeight: 700,
                    marginBottom: "8px",
                },
                tooltipContent: {
                    fontSize: "14px",
                    lineHeight: "1.6",
                },
                buttonNext: {
                    backgroundColor: "hsl(var(--primary))",
                    borderRadius: "10px",
                    padding: "8px 18px",
                    fontSize: "14px",
                    fontWeight: 600,
                },
                buttonBack: {
                    color: "var(--muted-foreground)",
                    fontSize: "14px",
                    fontWeight: 500,
                },
                buttonSkip: {
                    color: "var(--muted-foreground)",
                    fontSize: "13px",
                },
                spotlight: {
                    borderRadius: "12px",
                },
            }}
            locale={{
                back: "Back",
                close: "Close",
                last: "Finish",
                next: "Next",
                skip: "Skip Tour",
            }}
        />
    );
}

export function useOnboardingTour() {
    const [run, setRun] = useState(false);

    const startTour = useCallback(() => {
        const completed = localStorage.getItem(TOUR_KEY);
        if (!completed) {
            // Small delay to ensure DOM elements are rendered
            setTimeout(() => setRun(true), 500);
        }
    }, []);

    const onFinish = useCallback(() => {
        setRun(false);
    }, []);

    const Tour = useCallback(() => <TourComponent run={run} onFinish={onFinish} />, [run, onFinish]);

    return { startTour, TourComponent: Tour };
}
