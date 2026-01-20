import "./GradientButton.css";

export default function GradientButton({ text, onClick, type = "button" }) {
  return (
     <button className={`gradient-btn ${variant}`} type={type} onClick={onClick}>
      {text}
    </button>
  );
}
