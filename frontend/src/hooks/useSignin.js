import { useAuthContext } from "./useAuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useSignin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // ✅ Renamed for consistency
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const signinD = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/signind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      console.log("Raw response:", text);

      if (!text) {
        throw new Error("Empty response from server"); // ✅ Handle empty responses
      }

      const json = JSON.parse(text);

      if (!res.ok) {
        setLoading(false);
        setError(json.error || "Sign-in failed");
        return;
      }

      localStorage.setItem('user', JSON.stringify(json));
      dispatch({ type: 'LOGIN', payload: json });

      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.message || "Network error. Please try again."); // ✅ Improved error handling
      console.error(err);
    }
  };

  const signinA = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/signina', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      console.log("Raw response:", text);

      if (!text) {
        throw new Error("Empty response from server"); // ✅ Handle empty responses
      }

      const json = JSON.parse(text);

      if (!res.ok) {
        setLoading(false);
        setError(json.error || "Sign-in failed");
        return;
      }

      localStorage.setItem('user', JSON.stringify(json));
      dispatch({ type: 'LOGIN', payload: json });

      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.message || "Network error. Please try again."); // ✅ Improved error handling
      console.error(err);
    }
  };

  const signinH = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/signinh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      console.log("Raw response:", text);

      if (!text) {
        throw new Error("Empty response from server"); // ✅ Handle empty responses
      }

      const json = JSON.parse(text);

      if (!res.ok) {
        setLoading(false);
        setError(json.error || "Sign-in failed");
        return;
      }

      localStorage.setItem('user', JSON.stringify(json));
      dispatch({ type: 'LOGIN', payload: json });

      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.message || "Network error. Please try again."); // ✅ Improved error handling
      console.error(err);
    }
  };

  const signinHD = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/signinhd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      console.log("Raw response:", text);

      if (!text) {
        throw new Error("Empty response from server"); // ✅ Handle empty responses
      }

      const json = JSON.parse(text);

      if (!res.ok) {
        setLoading(false);
        setError(json.error || "Sign-in failed");
        return;
      }

      localStorage.setItem('user', JSON.stringify(json));
      dispatch({ type: 'LOGIN', payload: json });

      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.message || "Network error. Please try again."); // ✅ Improved error handling
      console.error(err);
    }
  };


  return { signinD, signinA, signinH, signinHD, loading, error };
};
