import { useToast } from "@contexts/ToastContext";
import "./css/footer.css";

const Footer = () => {
  const { addToast } = useToast();

  const handleDummyLink = (e) => {
    e.preventDefault();
    addToast("This is a mock link for demo purposes.", "success");
  };

  return (
    <footer className="footer">
      <div className="footerContent">
        <p>
          &copy; 2025 - {new Date().getFullYear()} <strong>Walter Pompa</strong>
          . All rights reserved. | <em>JobsiteSync</em>
        </p>
        <div className="footerLinks">
          <a href="#docs" onClick={handleDummyLink}>
            Documentation
          </a>
          <a href="#terms" onClick={handleDummyLink}>
            Terms of Service
          </a>
          <a href="#privacy" onClick={handleDummyLink}>
            Privacy Architecture
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
