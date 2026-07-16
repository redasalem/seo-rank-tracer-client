import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmail() {
    const { token } = useParams();
    const { verifyEmail } = useApp();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");
    const isVerifying = useRef(false);

    useEffect(() => {
        if (!token || isVerifying.current) return;
        isVerifying.current = true;

        const verify = async () => {
            const res = await verifyEmail(token);
            if (res.success) {
                setStatus("success");
                setMessage(res.message || "Email verified successfully!");
            } else {
                setStatus("error");
                setMessage(res.message || "Failed to verify email. The link might be expired or invalid.");
            }
        };

        verify();
    }, [token, verifyEmail]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-sm text-center">
                {status === "loading" && (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                        <h2 className="text-xl font-bold text-foreground">Verifying Email...</h2>
                        <p className="text-muted-foreground mt-2">Please wait while we confirm your email address.</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Verification Successful!</h2>
                        <p className="text-muted-foreground mb-8">{message}</p>
                        <Link 
                            to="/login"
                            className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
                            style={{ color: "var(--background)" }}
                        >
                            Continue to Login
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mb-6">
                            <XCircle className="w-8 h-8 text-danger" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Verification Failed</h2>
                        <p className="text-muted-foreground mb-8">{message}</p>
                        <Link 
                            to="/login"
                            className="bg-secondary text-secondary-foreground font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity border border-border"
                        >
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
