import {
  Alert,
  Button,
  CircularProgress,
  Input,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BannerImaige from "../../../public/cv2ceo.jpg";

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (token) {
      router.push("/builder");
    } else {
      router.push("/login");
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true); // Start loading

    if (validateForm()) {
      try {
        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("phone", formData.phone);

        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbxBI1J6fdO2hlm_tiZQPe5Hq7oydkSA3-UW23KXgB8VYOTM0XhP2l9CfpdMAZO9mSI/exec",
          {
            method: "POST",
            body: data,
          },
        );

        if (response.ok) {
          localStorage.setItem("user_token", "access_builder");
          setSuccess(true);
          setFormData({ name: "", email: "", phone: "" });

          const user_token = localStorage.getItem("user_token");
          if (user_token) {
            router.push("/builder");
          }
        } else {
          console.error("Failed to submit form");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }

    setLoading(false); // Stop loading after API response
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="w-full lg:grid min-h-[100svh] lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 w-full max-w-[470px] m-auto">
        <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
          <h3 className="text-4xl mb-12 text-resume-800">
            Enter the details to get started 👋
          </h3>
          <div>
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.name)}
            />
            {errors.name && (
              <Typography color="error" variant="caption">
                {errors.name}
              </Typography>
            )}
          </div>

          <div>
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.email)}
            />
            {errors.email && (
              <Typography color="error" variant="caption">
                {errors.email}
              </Typography>
            )}
          </div>

          <div>
            <Input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.phone)}
            />
            {errors.phone && (
              <Typography color="error" variant="caption">
                {errors.phone}
              </Typography>
            )}
          </div>

          {success && (
            <Alert severity="success">
              <Typography>Information submitted successfully!</Typography>
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </div>
      <div className="hidden bg-muted lg:block">
        <div className="relative h-full">
          <Image
            src={BannerImaige}
            alt="Authentication background"
            layout="fill"
            objectFit="contain"
            className="h-full w-full object-contain "
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
