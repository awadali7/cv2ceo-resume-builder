import { Alert, Button, CircularProgress, TextField } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  updateProfile,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import BannerImage from "../../../public/cv2ceo.jpg";
import { auth, db } from "../../../firebaseConfig";

interface FormData {
  name: string;
  email: string;
  phone: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  const [loading, setLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkEmailVerification = async () => {
      // Check if this is an email sign-in link
      if (isSignInWithEmailLink(auth, window.location.href)) {
        const email = localStorage.getItem("emailForSignIn");
        const storedFormData = localStorage.getItem("userFormData");

        if (email) {
          try {
            // Attempt to sign in with the email link
            const result = await signInWithEmailLink(
              auth,
              email,
              window.location.href,
            );
            console.log("User signed in:", result.user);

            // Get the user
            const user = result.user;

            // If stored form data exists, use it to update profile and Firestore
            if (storedFormData) {
              const parsedFormData = JSON.parse(storedFormData);

              // Update profile
              await updateProfile(user, {
                displayName: parsedFormData.name,
              });

              // Store user data in Firestore
              await setDoc(doc(db, "user", user.uid), {
                name: parsedFormData.name,
                email: email,
                phone: parsedFormData.phone,
                uid: user.uid,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
            }

            // Store user ID as token
            localStorage.setItem("user_token", user.uid);

            // Remove temporary storage items
            localStorage.removeItem("emailForSignIn");
            localStorage.removeItem("userFormData");

            // Remove query parameters from URL
            window.history.replaceState({}, document.title, "/builder");

            // Redirect to builder page
            router.push("/builder");
          } catch (error) {
            console.error("Email link sign-in error:", error);
            setErrors({
              email:
                "Verification failed. Please try again or request a new link.",
            });
          }
        } else {
          setErrors({
            email:
              "No email found for verification. Please start the process again.",
          });
        }
      } else {
        // Check if user is already logged in
        const token = localStorage.getItem("user_token");
        if (token) {
          router.push("/builder");
        }
      }
    };

    checkEmailVerification();
  }, [router]);

  const validateProfileData = (): boolean => {
    const newErrors: { name?: string; email?: string; phone?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[1-9]\d{6,14}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendEmailVerification = async () => {
    if (!validateProfileData()) return;

    setLoading(true);
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/builder`,
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, formData.email, actionCodeSettings);

      // Save email and form data for later use
      localStorage.setItem("emailForSignIn", formData.email);
      localStorage.setItem("userFormData", JSON.stringify(formData));

      setEmailSent(true);
      setErrors({});
    } catch (error: unknown) {
      console.error("Error sending email verification:", error);

      let errorMessage = "Failed to send verification email. Please try again.";

      if (typeof error === "object" && error !== null && "code" in error) {
        const firebaseError = error as { code: string };

        if (firebaseError.code === "auth/invalid-email") {
          errorMessage = "Invalid email format.";
        } else if (firebaseError.code === "auth/email-already-in-use") {
          errorMessage = "Email is already registered.";
        }
      }

      setErrors({ email: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid min-h-[100svh] lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 w-full max-w-[470px] m-auto">
        <div className="flex flex-col w-full gap-4">
          <h3 className="text-4xl mb-12 text-resume-800">
            Create your account 👋
          </h3>

          {emailSent && (
            <Alert severity="info" className="mb-4">
              Verification link sent to your email. Please check your inbox and
              spam folder.
            </Alert>
          )}

          {errors.email && (
            <Alert severity="error" className="mb-4">
              {errors.email}
            </Alert>
          )}

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

            <TextField
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              fullWidth
              error={Boolean(errors.phone)}
              helperText={errors.phone}
              variant="outlined"
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={sendEmailVerification}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Send Verification Email"
              )}
            </Button>
          </div>
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
