import {
  Alert,
  Button,
  CircularProgress,
  Input,
  Typography,
  TextField,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import BannerImage from "../../../public/cv2ceo.jpg";
import { auth, db } from "../../../firebaseConfig";

interface FormData {
  name: string;
  email: string;
  phone: string;
  otp: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    otp: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    otp?: string;
  }>({});

  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
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
          size: "normal",
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

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validateProfile = (): boolean => {
    const newErrors: { name?: string; email?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
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
      setErrors({});
      setActiveStep(1);
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
      setActiveStep(2);
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

  const saveProfile = async () => {
    if (!validateProfile()) return;

    setLoading(true);
    try {
      // Get current user (should be authenticated after OTP verification)
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Update profile with display name
      await updateProfile(user, { displayName: formData.name });

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Set token for future sessions
      localStorage.setItem("user_token", "access_builder");

      setSuccess(true);
      router.push("/builder");
    } catch (error) {
      console.error("Error saving profile:", error);
      setErrors({
        name: "Failed to save profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <h3 className="text-4xl mb-12 text-resume-800">
              Enter your phone number 👋
            </h3>
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
        );
      case 1:
        return (
          <>
            <h3 className="text-4xl mb-12 text-resume-800">Verify OTP 🔐</h3>
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
        );
      case 2:
        return (
          <>
            <h3 className="text-4xl mb-12 text-resume-800">
              Complete Your Profile ✨
            </h3>
            <div className="flex flex-col gap-4">
              <TextField
                label="Full Name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                fullWidth
                error={Boolean(errors.name)}
                helperText={errors.name}
                variant="outlined"
              />

              <TextField
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                fullWidth
                error={Boolean(errors.email)}
                helperText={errors.email}
                variant="outlined"
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={saveProfile}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full lg:grid min-h-[100svh] lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 w-full max-w-[470px] m-auto">
        <div className="flex flex-col w-full gap-4">
          <Stepper activeStep={activeStep} className="mb-8">
            <Step>
              <StepLabel>Phone</StepLabel>
            </Step>
            <Step>
              <StepLabel>Verify</StepLabel>
            </Step>
            <Step>
              <StepLabel>Profile</StepLabel>
            </Step>
          </Stepper>

          {renderStep()}

          {success && (
            <Alert severity="success">
              <Typography>Registration completed successfully!</Typography>
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
