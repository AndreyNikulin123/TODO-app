import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { type Register, RegisterSchema } from "./register.schema";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export const RegisterPage: React.FC = () => {
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Register>({
    resolver: zodResolver(RegisterSchema),
  });

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: Register) => {
    try {
      await registerUser(data.email, data.password, data.name);
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      setError("root", { message: "Сложности во время регистрации" });
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "100px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        Создать аккаунт
      </h2>

      {errors.root && (
        <div
          style={{
            color: "#EF4444",
            backgroundColor: "#FEE2E2",
            padding: "12px",
            borderRadius: "5px",
            marginBottom: "20px",
            border: "1px solid #FCA5A5",
          }}
        >
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "500",
            }}
          >
            Имя (опционально)
          </label>
          <input
            {...register("name")}
            type="text"
            placeholder="имя"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "10px",
              border: errors.name ? "1px solid #EF4444" : "1px solid #D1D5DB",
              borderRadius: "5px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
          {errors.name && (
            <p
              style={{
                color: "#EF4444",
                fontSize: "12px",
                marginTop: "5px",
                marginBottom: "0",
              }}
            >
              {errors.name.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "500",
            }}
          >
            Электронная почта
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="почта@email.com"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "10px",
              border: errors.email ? "1px solid #EF4444" : "1px solid #D1D5DB",
              borderRadius: "5px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
          {errors.email && (
            <p
              style={{
                color: "#EF4444",
                fontSize: "12px",
                marginTop: "5px",
                marginBottom: "0",
              }}
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "500",
            }}
          >
            Пароль
          </label>
          <div style={{ position: "relative" }}>
            <input
              {...register("password")}
              type="password"
              placeholder="пароль"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "10px",
                paddingRight: "40px",
                border: errors.password
                  ? "1px solid #EF4444"
                  : "1px solid #D1D5DB",
                borderRadius: "5px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>
          {errors.password && (
            <p
              style={{
                color: "#EF4444",
                fontSize: "12px",
                marginTop: "5px",
                marginBottom: "0",
              }}
            >
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: isSubmitting ? "#9CA3AF" : "#3B82F6",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            transition: "background-color 0.2s",
          }}
        >
          {isSubmitting ? "Создание аккаунта..." : "Зарегистрироваться"}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "14px",
          color: "#6B7280",
        }}
      >
        Уже есть аккаунт?{" "}
        <Link
          to="/login"
          style={{
            color: "#3B82F6",
            textDecoration: "underline",
            fontWeight: "500",
          }}
        >
          Войти
        </Link>
      </p>
    </div>
  );
};
