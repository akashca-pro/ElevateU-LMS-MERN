import useForm from "@/hooks/useForm";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";


function Login({ role, useLogin, useAuthActions }) {
  const { login } = useAuthActions();
  const navigate = useNavigate();
  const [loginAuth, { isLoading }] = useLogin();
  const { formData, handleChange, errors, togglePasswordVisibility, showPassword } = useForm();

  const isFormValid =
    Object.values(errors).some((err) => err) ||
    !formData.password ||
    !formData.email;

  const handleGoogleAuth = () => {
    window.location.href =
      role === "user"
        ? import.meta.env.VITE_GOOGLE_USER_AUTH_REQ
        : import.meta.env.VITE_GOOGLE_TUTOR_AUTH_REQ;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) return;

    const loginPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await loginAuth(formData).unwrap();
        login(response?.data?._id);
        resolve("Login successful!");
        navigate("/");
      } catch (error) {
        reject(error?.data?.message || "Login failed. Please try again.");
      }
    });

    toast.promise(loginPromise, {
      loading: "Logging in...",
      success: (msg) => msg,
      error: (err) => err,
    });
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="grid h-full w-full md:grid-cols-2 bg-white shadow-lg">
        <div className="flex items-center justify-center p-8 overflow-auto">
          <div className="w-full max-w-sm space-y-6">
             <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">
              {role === "user" ? "Student" : role === "tutor" ? "Tutor" : "Admin"} Log In
              </h1>
              {role!=='admin' && <p className="text-center text-sm text-gray-600">
                {`Are you a ${
                  role === "user" ? "tutor" : "student"
                }? Switch to ${
                  role === "user" ? "tutor" : "student"
                }`}{" "}
                <Link
                  to={`/${role === "user" ? "tutor" : "user"}/login`}
                  className="text-purple-600 hover:underline"
                >
                  Login here!
                </Link>
              </p>}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium block">
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-lg border p-2 focus:ring-2 ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 focus:border-purple-500/20"
                  }`}
                  placeholder="name@example.com"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="password" className="text-sm font-medium block">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full rounded-lg border p-2 focus:ring-2 ${
                      errors.password
                        ? "border-red-500"
                        : "border-gray-300 focus:border-purple-500/20"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>
              {role !== 'admin' && <a
                href={`/${role}/forgot-password`}
                className="block text-right text-sm text-primary hover:underline"
              >
                Forgot password?
              </a>}
              <button
                type="submit"
                disabled={isLoading || isFormValid}
                className={`w-full rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 
                  ${
                    isLoading || isFormValid
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary hover:bg-secondary"
                  }
                `}
              >
                Log in
              </button>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>
            {role !== 'admin' && <div className="grid gap-2">
              <button
                onClick={handleGoogleAuth}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white p-2 text-sm font-medium hover:bg-gray-50"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="h-5 w-5"
                />
                Continue with Google
              </button>
            </div>}
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <a href={`/${role}/sign-up`} className="text-primary hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center bg-[#1D1042] p-8 text-white w-full h-full">
          <div className="max-w-md space-y-4 text-center">
            <p className="text-2xl font-light">
            The only way to do <span className="text-purple-400">great work</span>, is to{" "}
              <span className="text-purple-400">love</span> what you do.
            </p>
            <p className="text-sm">- Steve Jobs</p>
            <img src="/Login.svg" alt="" className="w-[710px] h-[595px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;