import {
  Alert,
  Button,
  CircularProgress,
  Input,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import BannerImage from "../../../public/cv2ceo.jpg";
import { auth } from "../../../firebaseConfig";

interface FormData {
  phone: string;
  otp: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    phone: "",
    otp: "",
  });

  const [errors, setErrors] = useState<{ phone?: string; otp?: string }>({});
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (token) {
      router.push("/builder");
    }

    // Initialize RecaptchaVerifier
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal", // Changed from 'invisible' to 'normal'
          callback: () => {
            // Enable the send OTP button when reCAPTCHA is solved
            const sendOtpButton = document.querySelector(
              '[data-testid="send-otp-button"]',
            );
            if (sendOtpButton) {
              (sendOtpButton as HTMLButtonElement).disabled = false;
            }
          },
          "expired-callback": () => {
            // Disable the send OTP button when reCAPTCHA expires
            const sendOtpButton = document.querySelector(
              '[data-testid="send-otp-button"]',
            );
            if (sendOtpButton) {
              (sendOtpButton as HTMLButtonElement).disabled = true;
            }
            setErrors({ phone: "reCAPTCHA expired. Please verify again." });
          },
        },
      );

      // Force reCAPTCHA to render
      recaptchaVerifierRef.current.render();
    }

    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  const validatePhone = (): boolean => {
    const newErrors: { phone?: string } = {};

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOtp = async () => {
    if (!validatePhone() || !recaptchaVerifierRef.current) return;

    setLoading(true);
    try {
      const phoneNumber = `+91${formData.phone.replace(/\D/g, "")}`;
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifierRef.current,
      );

      setConfirmationResult(confirmation);
      setOtpSent(true);
      setErrors({});
    } catch (error: unknown) {
      console.error("Error sending OTP:", error);

      let errorMessage = "Failed to send OTP. Please try again.";

      // Type guard to check if error is an object with a 'code' property
      if (typeof error === "object" && error !== null && "code" in error) {
        const firebaseError = error as { code: string };

        if (firebaseError.code === "auth/invalid-phone-number") {
          errorMessage = "Invalid phone number format.";
        } else if (firebaseError.code === "auth/quota-exceeded") {
          errorMessage = "SMS quota exceeded. Please try again later.";
        } else if (firebaseError.code === "auth/billing-not-enabled") {
          errorMessage =
            "Service temporarily unavailable. Please try again later.";
        }
      }

      setErrors({ phone: errorMessage });

      // Reset reCAPTCHA on error
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "normal",
            callback: () => {},
            "expired-callback": () => {},
          },
        );
        recaptchaVerifierRef.current.render();
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!formData.otp.trim() || formData.otp.length !== 6) {
      setErrors({ otp: "Enter a valid 6-digit OTP" });
      return;
    }

    if (!confirmationResult) {
      setErrors({
        otp: "OTP confirmation not initialized. Please request a new OTP.",
      });
      return;
    }

    setLoading(true);
    try {
      await confirmationResult.confirm(formData.otp);
      localStorage.setItem("user_token", "access_builder");
      setSuccess(true);
      router.push("/builder");
    } catch (error: unknown) {
      console.error("Invalid OTP:", error);

      let errorMessage = "Verification failed. Please try again.";

      // Type guard to safely check the error object
      if (typeof error === "object" && error !== null && "code" in error) {
        const firebaseError = error as { code: string };

        if (firebaseError.code === "auth/invalid-verification-code") {
          errorMessage = "Invalid OTP. Please check and try again.";
        }
      }

      setErrors({ otp: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid min-h-[100svh] lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 w-full max-w-[470px] m-auto">
        <div className="flex flex-col w-full gap-4">
          <h3 className="text-4xl mb-12 text-resume-800">
            Enter your phone number 👋
          </h3>

          {!otpSent ? (
            <>
              <Input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                fullWidth
                error={Boolean(errors.phone)}
              />
              {errors.phone && (
                <Typography color="error" variant="caption">
                  {errors.phone}
                </Typography>
              )}

              <div id="recaptcha-container" className="mb-4"></div>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={sendOtp}
                disabled={loading}
                data-testid="send-otp-button"
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Send OTP"
                )}
              </Button>
            </>
          ) : (
            <>
              <Input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, otp: e.target.value }))
                }
                fullWidth
                error={Boolean(errors.otp)}
              />
              {errors.otp && (
                <Typography color="error" variant="caption">
                  {errors.otp}
                </Typography>
              )}

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={verifyOtp}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Verify OTP"
                )}
              </Button>
            </>
          )}

          {success && (
            <Alert severity="success">
              <Typography>Phone verified successfully!</Typography>
            </Alert>
          )}
        </div>
      </div>

      <div className="hidden bg-muted lg:block">
        <div className="relative h-full">
          <Image
            src={BannerImage}
            alt="Authentication background"
            layout="fill"
            objectFit="contain"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
